import React from 'react'
import { Person } from '../../extension/background-script/PeopleService'
import { ValueRef } from '@holoflows/kit/es'
import { MessageCenter } from '../../utils/messages'
import { PeopleService } from '../../extension/content-script/rpc'

const ref = new ValueRef<Person[]>([])
ref.startWatch()
PeopleService.getAllPeople().then(p => (ref.value = p))
MessageCenter.on('newPerson', p => {
    const old = ref.value.filter(x => x.username !== p.username)
    ref.value = [...old, p]
})
export function usePeople() {
    const [people, setPeople] = React.useState<Person[]>([])
    const cb = React.useCallback(() => setPeople(ref.value), [setPeople])
    React.useEffect(() => {
        ref.addListener('onChange', cb)
        return () => (ref.removeListener('onChange', cb), void 0)
    })
    return people
}