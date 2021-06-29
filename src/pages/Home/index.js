import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import { getPokemon, getAllPokemon } from "../../services/allPokemon";
import "./style.scss";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  // const [firstResponse, setFirstResponse] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      // setFirstResponse(response.results);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, []);

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await getPokemon(pokemon);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
    // console.log(pokemonData);
  };

  return (
    <>
      <Container>
        {loading ? (
          <h1 style={{ textAlign: "center" }}>Loading...</h1>
        ) : (
          <>
            <Box>
              <IconButton variant="outlined" color="primary" onClick={prev}>
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton variant="outlined" color="primary" onClick={next}>
                <NavigateNextIcon />
              </IconButton>
            </Box>
            <div className="grid-home">
              {pokemonData.map(
                (pokemon, i) => (
                  <div m={2} key={i} className="box-wrapper" maxWidth={170}>
                    <Link to={`/${pokemon.name}`} className="link-title">
                      <Card
                        url={pokemon.url}
                        key={i}
                        pokemon={pokemon}
                        className="card-wrapper"
                      />
                    </Link>
                  </div>
                )
                //                   {
                //       return <Link to={`/${pokemonData.name}`} key={i}><Card key={i} pokemon={pokemon} /></Link>;
                //   }
              )}
            </div>
            <Box>
              <IconButton variant="outlined" color="primary" onClick={prev}>
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton variant="outlined" color="primary" onClick={next}>
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Container>
    </>
  );
}

export default Home;
