import React, { Component } from 'react';
import axios from "axios";
import CardMedia from '@material-ui/core/CardMedia';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import { Paper, Typography, Grid, Card, Input } from "@material-ui/core";

let timer;
let inputMovie;
let page;

class App extends Component {
	constructor(props){
		super(props)
		this.state = {
			movies: [],
			termo:[],
			currentPage: 1
		}
	}

	startMyMovies = () => {
		if(localStorage.getItem('myMovies') === null){
			localStorage.setItem('myMovies', '{"ids": []}');
		}
	}

	addMovie = (e) => {
		let idmovie = e.currentTarget.attributes['data-id'].value;
		let movieUpdate = JSON.parse(window.localStorage.getItem('myMovies'));
		console.log(idmovie);
		movieUpdate['ids'].concat(movieUpdate['ids'].push({'id': idmovie}));
		localStorage.setItem('myMovies', JSON.stringify(movieUpdate));
	}

	buscaMovie = () =>{
		let busca = this;
		page = this.currentPage;
		clearTimeout(timer);
		timer = setTimeout(function () {
			inputMovie = document.getElementById("movieBusca").value;;
			axios.get('http://www.omdbapi.com/?apikey=4e001895&page='+page+'&s=' + inputMovie)
			.then(resp => {
				console.log(resp);
				if(resp.data.Response === "False"){
					const buscaTerm = 'Buscando por ' + inputMovie + ' não retornou nada';
					busca.setState({termo: buscaTerm});
				} else {
					const buscaTerm = 'Buscando por ' + inputMovie;
					busca.setState({movies: resp.data.Search, termo: buscaTerm});
				}
			});

		}, 1000);
	}

	componentDidMount(){
		this.startMyMovies();
	}

	render(){
		return (
			<main className="movies">
				<Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{paddingTop: 30, marginBottom: 50}}>
					<Paper style={{padding: '10px', maxWidth: '1024px', width: 'calc(100% - 50px)'}}>
						<Typography component="h1" variant="h5" style={{textAlign: 'center'}}>Movie App</Typography>
						<Grid container justify="center" alignItems="center" className="busca" style={{textAlign: 'center', marginTop: 15, marginBottom: 30}}>
							<Input id="movieBusca" placeholder="Digite o nome do filme..." onKeyPress={this.buscaMovie}></Input>
						</Grid>
						<Typography style={{marginBottom: 30}} className="termo" variant="button" gutterBottom>{this.state.termo}</Typography>
						<Grid container direction="row" alignItems="flex-start" justify="space-around" className="resultado">
							{this.state.movies.map((movies, id) => (<Card key={id} style={{maxWidth: 300, width: '100%', marginBottom: 30, minHeight: 570, position: 'relative'}}>
								<Fab color="secondary" aria-label="Add" className="Add" style={{position: 'absolute', bottom: 15, right: 15}} data-id={movies.imdbID} onClick={this.addMovie}>
									<AddIcon />
								</Fab>
								<CardMedia image={movies.Poster} title={movies.Title} style={{height: 465}} />
								<Divider />
								<Typography style={{padding: 10}} component="p">{movies.Title} <br /> {movies.Year}</Typography>
							</Card>))}
						</Grid>
					</Paper>
					<Typography variant="overline" gutterBottom>By Davi</Typography>
				</Grid>
			</main>
		);
	}
}

export default App;
