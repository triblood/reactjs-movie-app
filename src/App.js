import React, { Component } from 'react';
import axios from "axios";
import CardMedia from '@material-ui/core/CardMedia';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import { Paper, Button, Typography, Grid, Card, Input } from "@material-ui/core";

let timer;
let inputMovie;
let page;

class App extends Component {
	constructor(props){
		super(props)
		this.state = {
			movies: [],
			listMovie: [],
			termo: false,
			lastPage: null,
			currentPage: 1,
			listName: []
		}

		this.loadMovies = this.loadMovies.bind(this);
	}

	startMyMovies = () => {
		if(localStorage.getItem('myMovies') === null){
			localStorage.setItem('myMovies', '{"ids": []}');
		}

		let listaMovies = JSON.parse(window.localStorage.getItem('myMovies')).ids;
		this.setState({listMovie: listaMovies});
	}

	addMovie = (e) => {
		let idmovie = e.currentTarget.attributes['data-id'].value;
		let movieUpdate = JSON.parse(window.localStorage.getItem('myMovies'));
		// console.log(idmovie);
		movieUpdate['ids'].concat(movieUpdate['ids'].push({'id': idmovie}));
		localStorage.setItem('myMovies', JSON.stringify(movieUpdate));
	}

	loadMovies(pg, termo){
		let self = this;
		axios.get('http://www.omdbapi.com/?apikey=4e001895&page='+pg+'&s=' + termo)
		.then(resp => {
			// console.log(resp);
			if(resp.data.Response === "True"){
				// self.setState({termo: termo});
				let movieList = self.state.movies.concat(resp.data.Search);
				let pages = Math.ceil(parseFloat(parseInt(resp.data.totalResults) / 10));
				// console.log(pages)
				self.setState({lastPage: pages})
				self.setState({movies: movieList});
			}
		});
	}

	// itemLoad = ()(id){
	// 	axios.get('http://www.omdbapi.com/?apikey=4e001895&i=' + id)
	// 	.then(res => {
	// 		console.log(res);
	// 	})
	// }

	buscaMovie = () =>{
		this.setState({currentPage: 1});
		page = this.state.currentPage;
		let self = this;
		clearTimeout(timer);
		timer = setTimeout(function () {
			inputMovie = document.getElementById("movieBusca").value;
			// debugger;
			self.setState({movies: []});
			self.setState({termo: inputMovie});
			self.loadMovies(page, inputMovie);

		}, 1000);
	}

	componentDidMount(){
		this.startMyMovies();
		let self = this;
		window.onscroll = function(){
			// debugger;
			let mainDiv = document.getElementById("mainDiv");
			const bottomPosition = mainDiv.scrollTop + mainDiv.scrollHeight;
			const documentHeight = window.pageYOffset + document.documentElement.clientHeight;
			if(bottomPosition === documentHeight) {
				// debugger;
				let pageNum = self.state.currentPage + 1;
				self.setState({currentPage: pageNum});
				if(self.state.lastPage >= pageNum){
					self.loadMovies(pageNum, inputMovie);
				}
			}
		}

	}

	async getInfo(idsArr) {
		let titleArr = []
		console.log(idsArr)
		for(let idObj of idsArr) {
			const {data: {Title}} = await axios.get('http://www.omdbapi.com/?apikey=4e001895&i=' + idObj.id)
			titleArr.push(Title)
		}
		console.log(titleArr)
		return (titleArr);
	}

	toggleDrawer = async (side, open) => {
		const listaMovies = JSON.parse(window.localStorage.getItem('myMovies')).ids;
		const titles = this.getInfo(listaMovies)
		this.setState({[side]: open, listMovie: listaMovies, listName: titles});
	};

	render(){
		return (
			<main className="movies" id="mainDiv">
				<Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{paddingTop: 30, marginBottom: 50}}>
					<Paper style={{padding: '10px', maxWidth: '1024px', width: 'calc(100% - 50px)'}}>
						<Typography component="h1" variant="h5" style={{textAlign: 'center'}}>Movie App</Typography>
						<Grid container justify="space-around" alignItems="center" className="busca" style={{textAlign: 'center', marginTop: 15, marginBottom: 30}}>
							<Input id="movieBusca" placeholder="Digite o nome do filme..." onKeyPress={() => this.buscaMovie()}></Input>
							<Button onClick={() => this.toggleDrawer('left', true)}>Meus filmes</Button>
						</Grid>
						{this.state.movies.length > 0 ?
							<Typography style={{marginBottom: 30}} className="termo" variant="button" gutterBottom>Resultado de busca para {this.state.termo}</Typography> :
							(this.state.termo !== false && <Typography style={{marginBottom: 30}} className="termo" variant="button" gutterBottom>Nada foi achado com {this.state.termo}</Typography>)
						}
						<Grid container direction="row" alignItems="flex-start" justify="space-around" className="resultado">
							{this.state.movies.map((movies, id) => (<Card key={id} style={{maxWidth: 300, width: '100%', marginBottom: 30, minHeight: 570, position: 'relative'}}>
								<Fab color="secondary" aria-label="Add" className="Add" style={{position: 'absolute', bottom: 15, right: 15}} data-id={movies.imdbID} onClick={() => this.addMovie()}>
									<AddIcon />
								</Fab>
								<CardMedia image={movies.Poster} title={movies.Title} style={{height: 465}} />
								<Divider />
								<Typography style={{padding: 10}} component="p">{movies.Title} <br /> {movies.Year}</Typography>
							</Card>))}
						</Grid>
					</Paper>
					<Typography id="teste" variant="overline" gutterBottom>By Davi</Typography>
				</Grid>
				<Drawer open={this.state.left} onClose={() => this.toggleDrawer('left', false)}>
					<div
						tabIndex={0}
						role="button"
						onClick={() => this.toggleDrawer('left', false)}
						onKeyDown={() => this.toggleDrawer('left', false)}
					>
						{ (this.state.listMovie.length > 0 && (
							this.state.listMovie.map((itemMovie, key) => (
									<div key={key}>{}</div>
								))
						)) }
					</div>
				</Drawer>
			</main>
		);
	}
}

export default App;
