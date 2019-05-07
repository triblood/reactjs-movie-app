import React, { Component } from 'react';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import { Paper, Button, Typography, Grid, Input } from "@material-ui/core";

import { MovieCard } from './components'

let timer;
let inputMovie;
let page;

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			movies: [],
			listMovie: [],
			termo: false,
			lastPage: null,
			currentPage: 1,
			listName: []
		}
		this.addMovie = this.addMovie.bind(this)

		this.loadMovies = this.loadMovies.bind(this);
	}

	startMyMovies = () => {
		if (localStorage.getItem('myMovies') === null) {
			localStorage.setItem('myMovies', '{"ids": []}');
		}

		let listaMovies = JSON.parse(window.localStorage.getItem('myMovies')).ids;
		this.setState({ listMovie: listaMovies });
	}

	addMovie = movieId => {
		let movieUpdate = JSON.parse(window.localStorage.getItem('myMovies'));
		// console.log(idmovie);
		// movieUpdate['ids'].concat(movieUpdate['ids'].push({'id': idmovie}));
		// localStorage.setItem('myMovies', JSON.stringify(movieUpdate));

		axios.get(`https://www.omdbapi.com/?apikey=4e001895&i=${movieId}`)
			.then(res => {
				console.log(res);

				let movieImg = res.data.Poster;
				let movieTitle = res.data.Title;
				let moviePlot = res.data.Plot;
				let movieYearRelease = res.data.Year;

				movieUpdate['ids'].concat(movieUpdate['ids'].push({ 'id': movieId, 'poster': movieImg, 'title': movieTitle, 'plot': moviePlot, 'year': movieYearRelease }));
				localStorage.setItem('myMovies', JSON.stringify(movieUpdate));
			})

	}

	async loadMovies(pg, termo) {
		const { data: { Response, Search, totalResults } } = await axios.get(`https://www.omdbapi.com/?apikey=4e001895&page=${pg}&s=${termo}`)
		if (Response === "True") {
			const movies = [...this.state.movies, ...Search]
			const lastPage = Math.ceil(parseFloat(parseInt(totalResults) / 10));
			this.setState({ lastPage, movies })
		}
	}

	buscaMovie = () => {
		this.setState({ currentPage: 1 });
		page = this.state.currentPage;
		let self = this;
		clearTimeout(timer);
		timer = setTimeout(function () {
			inputMovie = document.getElementById("movieBusca").value;
			// debugger;
			self.setState({ movies: [], termo: inputMovie });
			self.loadMovies(page, inputMovie);

		}, 1000);
	}

	componentDidMount() {
		this.startMyMovies();
		let self = this;
		window.onscroll = function () {
			// debugger;
			let mainDiv = document.getElementById("mainDiv");
			const bottomPosition = mainDiv.scrollTop + mainDiv.scrollHeight;
			const documentHeight = window.pageYOffset + document.documentElement.clientHeight;
			if (bottomPosition === documentHeight) {
				// debugger;
				let pageNum = self.state.currentPage + 1;
				self.setState({ currentPage: pageNum });
				if (self.state.lastPage >= pageNum) {
					self.loadMovies(pageNum, inputMovie);
				}
			}
		}

	}

	toggleDrawer = (side, open) => {
		const listaMovies = JSON.parse(window.localStorage.getItem('myMovies')).ids;
		// const titles = this.getInfo(listaMovies)
		this.setState({ [side]: open, listMovie: listaMovies });
	};

	render() {
		const { termo, left, movies } = this.state
		return (
			<main className="movies" id="mainDiv">
				<Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ paddingTop: 30, marginBottom: 50 }}>
					<Paper style={{ padding: '10px', maxWidth: '1024px', width: 'calc(100% - 50px)' }}>
						<Typography component="h1" variant="h5" style={{ textAlign: 'center' }}>Movie App</Typography>
						<Grid container justify="space-around" alignItems="center" className="busca" style={{ textAlign: 'center', marginTop: 15, marginBottom: 30 }}>
							<Input id="movieBusca" placeholder="Digite o nome do filme..." onKeyPress={this.buscaMovie}></Input>
							<Button onClick={() => this.toggleDrawer('left', true)}>Meus filmes</Button>
						</Grid>
						{movies.length > 0 ?
							<Typography style={{ marginBottom: 30 }} className="termo" variant="button" gutterBottom>{termo && `Resultado de busca para "${termo}"`}</Typography>
							: <Typography style={{ marginBottom: 30 }} className="termo" variant="button" gutterBottom>{termo ? `Nada foi achado com "${termo}"` : 'Digite alguma coisa'}</Typography>
						}
						<Grid container direction="row" alignItems="flex-start" justify="space-around" className="resultado">
							{movies.map(({ imdbID, ...movie }, id) => <MovieCard movie={movie} onClick={() => this.addMovie(imdbID)} key={`movie_${id}`} />)}
						</Grid>
					</Paper>
					<Typography id="teste" variant="overline" gutterBottom>By Davi</Typography>
				</Grid>
				<Drawer open={left} onClose={() => this.toggleDrawer('left', false)}>
					<div
						tabIndex={0}
						role="button"
						onClick={() => this.toggleDrawer('left', false)}
						onKeyDown={() => this.toggleDrawer('left', false)}
					>
						<Typography variant="overline" style={{ fontWeight: 700, margin: '15px 10px' }} gutterBottom>Meus filmes</Typography>
						{this.state.listMovie.map((myMovie, id) => (
							<div className="myMovie" key={id} style={{ width: '100%', float: 'left', marginBottom: 25 }}>
								<div className="img" style={{ width: '33%', float: 'left', margin: '0 10px' }}><img src={myMovie.poster} alt={myMovie.title} style={{ width: '100%', height: 'auto' }} /></div>
								<div className="info" style={{ float: 'left', width: 'calc(66% - 30px)' }}>
									<span className="title">
										<Typography variant="overline" style={{ lineHeight: 1.66 }} gutterBottom>{myMovie.title}</Typography>
									</span>
									<span className="plot"><Typography variant="caption" gutterBottom>Resumo: {myMovie.plot}</Typography></span>
									<span className="release"><Typography variant="caption" gutterBottom>Lançado em: {myMovie.year}</Typography></span>
								</div>
							</div>))}
					</div>
				</Drawer>
			</main>
		);
	}
}

export default App;
