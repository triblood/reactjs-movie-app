import React from 'react'
import { Card, CardMedia, Divider, Typography } from "@material-ui/core"

import { AddButton } from './AddButton'

export function MovieCard({ movie, onClick }) {
    const { id, Poster, Title, Year } = movie
    return (<Card key={id} style={{ maxWidth: 300, width: '100%', marginBottom: 30, minHeight: 570, position: 'relative' }}>
        <AddButton onClick={onClick} />
        <CardMedia image={Poster} title={Title} style={{ height: 465 }} />
        <Divider />
        <Typography style={{ padding: 10 }} component="p">{Title} <br /> {Year}</Typography>
    </Card>)
}