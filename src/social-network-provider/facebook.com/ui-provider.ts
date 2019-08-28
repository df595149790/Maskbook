import { defineSocialNetworkUI } from '../../social-network/ui'
import { ValueRef } from '@holoflows/kit/es'
import { InitFriendsValueRef } from '../../social-network/defaults/FriendsValueRef'
import { InitMyIdentitiesValueRef } from '../../social-network/defaults/MyIdentitiesRef'
import { sharedProvider } from './shared-provider'
import { PersonIdentifier } from '../../database/type'
import { injectPostBoxFacebook } from './UI/injectPostBox'
import { collectPeopleFacebook } from './UI/collectPeople'
import { pasteIntoPostBoxFacebook } from './tasks/pasteIntoPostBox'
import { getPostContentFacebook } from './tasks/getPostContent'
import { resolveLastRecognizedIdentityFacebook } from './UI/resolveLastRecognizedIdentity'
import { getProfileFacebook } from './tasks/getProfile'
import { pasteIntoBioFacebook } from './tasks/pasteIntoBio'
import { shouldDisplayWelcomeDefault } from '../../social-network/defaults/shouldDisplayWelcome'
import { injectWelcomeBannerFacebook } from './UI/injectWelcomeBanner'
import { injectPostCommentsDefault } from '../../social-network/defaults/injectComments'
import { dispatchCustomEvents, selectElementContents, sleep } from '../../utils/utils'
import { collectPostsFacebook } from './UI/collectPosts'
import { injectPostInspectorFacebook } from './UI/injectPostInspector'
import { setStorage } from '../../utils/browser.storage'
import { isMobileFacebook } from './isMobile'
import { geti18nString } from '../../utils/i18n'
import { injectCommentBoxDefaultFactory } from '../../social-network/defaults/injectCommentBox'
import { notNullable } from '../../utils/assert'

defineSocialNetworkUI({
    ...sharedProvider,
    init(env, pref) {
        sharedProvider.init(env, pref)
        InitFriendsValueRef(this, 'facebook.com')
        InitMyIdentitiesValueRef(this, 'facebook.com')
    },
    shouldActivate() {
        return location.hostname.endsWith('facebook.com')
    },
    friendlyName: 'Facebook',
    async setupAccount() {
        await browser.permissions.request({ origins: ['https://www.facebook.com/*', 'https://m.facebook.com/*'] })
        await setStorage('facebook.com', { forceDisplayWelcome: true })
        location.href = 'https://facebook.com/'
    },
    ignoreSetupAccount() {
        setStorage('facebook.com', { userIgnoredWelcome: true, forceDisplayWelcome: false })
    },
    shouldDisplayWelcome: shouldDisplayWelcomeDefault,
    friendsRef: new ValueRef([]),
    myIdentitiesRef: new ValueRef([]),
    currentIdentity: new ValueRef(null),
    lastRecognizedIdentity: new ValueRef({ identifier: PersonIdentifier.unknown }),
    posts: new Map(),
    resolveLastRecognizedIdentity: resolveLastRecognizedIdentityFacebook,
    injectPostBox: injectPostBoxFacebook,
    injectWelcomeBanner: injectWelcomeBannerFacebook,
    injectPostComments: injectPostCommentsDefault(),
    injectCommentBox: injectCommentBoxDefaultFactory(async function onPasteToCommentBoxFacebook(
        encryptedComment,
        current,
    ) {
        const fail = () => {
            prompt(geti18nString('comment_box__paste_failed'), encryptedComment)
        }
        if (isMobileFacebook) {
            const root = notNullable(current.commentBoxSelector).evaluate()
            if (!root) return fail()
            const textarea = root.querySelector('textarea')
            if (!textarea) return fail()
            textarea.focus()
            dispatchCustomEvents('input', encryptedComment)
            await sleep(200)
            if (!root.innerText.includes(encryptedComment)) return fail()
        } else {
            const root = current.rootNode
            if (!root) return fail()
            const input = root.querySelector('[contenteditable]')
            if (!input) return fail()
            selectElementContents(input)
            dispatchCustomEvents('paste', encryptedComment)
            await sleep(200)
            if (!root.innerText.includes(encryptedComment)) return fail()
        }
    }),
    injectPostInspector: injectPostInspectorFacebook,
    collectPeople: collectPeopleFacebook,
    collectPosts: collectPostsFacebook,
    taskPasteIntoPostBox: pasteIntoPostBoxFacebook,
    taskPasteIntoBio: pasteIntoBioFacebook,
    taskGetPostContent: getPostContentFacebook,
    taskGetProfile: getProfileFacebook,
})