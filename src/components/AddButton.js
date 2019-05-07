import React from 'react'
import AddIcon from '@material-ui/icons/Add';
import { Fab } from "@material-ui/core"

export function AddButton(props) {
    return <Fab color="secondary" aria-label="Add" className="Add" style={{ position: 'absolute', bottom: 15, right: 15 }} {...props}>
        <AddIcon />
    </Fab>
}