import React from 'react'
import StepBase from './StepBase'
import { Button, Box, Typography, styled, Theme } from '@material-ui/core'
import { geti18nString } from '../../../utils/i18n'
import { useHistory, Link } from 'react-router-dom'

const VerticalCenter = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 180,
})
const LinedBox = styled('div')(({ theme }: { theme: Theme }) => ({
    border: '1px solid #ddd',
    borderRadius: theme.shape.borderRadius,
    textAlign: 'start',
    width: '100%',
    padding: '1rem 1.25rem',
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
        '& > *': { minWidth: '100%' },
        textAlign: 'center',
    },
    '&:not(:first-child)': {
        marginTop: theme.spacing(4),
    },
}))

export default function InitStep0() {
    const header = 'You can post on Facebook without allowing Facebook to stalk or watch you.'

    const content = (
        <div style={{ width: '100%' }}>
            <LinedBox>
                <Box flex={1}>
                    <Typography variant="h6">New User</Typography>
                    <Typography variant="body1">Set up and start using.</Typography>
                </Box>
                <VerticalCenter>
                    <Button variant="contained" color="primary" component={Link} to="1s">
                        Set up
                    </Button>
                </VerticalCenter>
            </LinedBox>
            <LinedBox>
                <Box flex={1}>
                    <Typography variant="h6">Returning User</Typography>
                    <Typography variant="body1">Import database backup.</Typography>
                </Box>
                <VerticalCenter>
                    <Button variant="outlined" component={Link} to="1r">
                        {geti18nString('restore')}
                    </Button>
                </VerticalCenter>
            </LinedBox>
        </div>
    )
    return <StepBase subheader={header}>{content}</StepBase>
}