import React, { useState, useCallback } from 'react'
import { SelectPeopleUI } from './SelectPeople'
import Dialog from '@material-ui/core/Dialog/Dialog'
import { Person } from '../../extension/background-script/PeopleService'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Button from '@material-ui/core/Button/Button'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions/DialogActions'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import { withStylesTyped } from '../../utils/theme'
interface Props {
    open: boolean
    people: Person[]
    onClose(): void
    onSelect(people: Person[]): Promise<void>
}
export const SelectPeopleDialog = withStylesTyped({
    title: { paddingBottom: 0 },
    content: { padding: '0 12px' },
    progress: { marginRight: 6 },
})<Props>(({ classes, ...props }) => {
    const [people, select] = useState<Person[]>([] as Person[])
    const [committed, setCommitted] = useState(false)
    const onClose = useCallback(() => {
        props.onClose()
        setCommitted(false)
        select([])
    }, [props.onClose])
    const share = useCallback(() => {
        setCommitted(true)
        // TODO: On rejected
        props.onSelect(people).then(onClose)
    }, [people])
    // useEsc(() => (committed ? void 0 : onClose))
    return (
        <Dialog onClose={onClose} open={props.open} scroll="paper" fullWidth maxWidth="sm">
            <DialogTitle className={classes.title}>Share to ...</DialogTitle>
            <DialogContent className={classes.content}>
                <SelectPeopleUI disabled={committed} all={props.people} selected={people} onSetSelected={select} />
            </DialogContent>
            <DialogActions>
                <Button size="large" disabled={committed} onClick={onClose}>
                    Cancel
                </Button>
                <Button size="large" disabled={committed || people.length === 0} color="primary" onClick={share}>
                    {committed && <CircularProgress className={classes.progress} size={16} variant="indeterminate" />}
                    {committed ? 'Sharing' : 'Share'}
                </Button>
            </DialogActions>
        </Dialog>
    )
})

export function useShareMenu(people: Person[], onSelect: (people: Person[]) => Promise<void>) {
    const [show, setShow] = useState(false)
    const showShare = useCallback(() => setShow(true), [])
    const hideShare = useCallback(() => setShow(false), [])

    return {
        showShare,
        // hideShare,
        ShareMenu: <SelectPeopleDialog people={people} open={show} onClose={hideShare} onSelect={onSelect} />,
    }
}