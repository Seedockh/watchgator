import React, { FunctionComponent, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Icon, Content, Grid, Row, Col, Panel, Nav, Button, Avatar, Rate, List } from 'rsuite'
import { TagList } from '../widget/TagList'
import { Searchbar } from '../widget/Searchbar'
import PlaceholderParagraph from 'rsuite/lib/Placeholder/PlaceholderParagraph'

type MovieDetailsProps = {
    movieId: string;
}

type Media = {
  id: string
  title: string
  year: number
  rating: number
  nbRatings: number
  metaScore: number
  certificate: string
  runtime: number
  genres: Genre[]
  description: string
  picture: string
  directors: People[]
  actors: People[]
  gross: string
}

export type Genre = {
  name: string
}

type People = {
  id: string
	name: string
}

export const MovieDetails: FunctionComponent<MovieDetailsProps> = (props) => {
    const [activeTab, setActiveTab] = useState("overview")
    const [movie, setMovie] = useState<Media | null>(null)
    const [genres, setGenres] = useState<string[]>([])
    const history = useHistory()

    useEffect(() => {
      // @ts-ignore
      if (history.location.state) {
        // @ts-ignore
        setMovie(history.location.state.movie)
      } else fetchMovie()
    }, [history])

    useEffect(() => {
      if (movie) {
        let movieGenres: string[] = []
        movie.genres.map(genre => movieGenres.push(genre.name))
        setGenres(movieGenres)
      }
    }, [movie])

    const fetchMovie = async () => {
      if (history && movie === null) {
        fetch(`${process.env.REACT_APP_API_URI}/movies/${window.location.href.split('/')[4]}`)
          .then(response => response.json())
          .then(movie => setMovie(movie))
          .catch(error => console.log(error))
      }
    }

    const renderTabs = (): JSX.Element => {
        if (movie && activeTab === 'overview') {
            return <p>{movie.description}</p>
        }
        if (activeTab === 'trailer') {
            return <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/2ekI3AvmqOk"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                title='Movie trailer'
            />
        }
        if (movie && activeTab === 'details') {
            return (
              <List className="movie-details-list">
                <List.Item key={`movie-year`} index={0}>
                  <strong>Year</strong> {movie.year ?? '-'}
                </List.Item>
                <List.Item key={`movie-nbRatings`} index={1}>
                  <strong>People critics</strong> {movie.nbRatings ?? '0'}
                </List.Item>
                <List.Item key={`movie-metaScore`} index={2}>
                  <strong>MetaScore</strong> {movie.metaScore ?? '-'}
                </List.Item>
                <List.Item key={`movie-certificate`} index={3}>
                  <strong>Certificate</strong> {movie.certificate ?? '-'}
                </List.Item>
                <List.Item key={`movie-directors`} index={4}>
                  <strong>Directors </strong>
                    {movie.directors.length > 0 ?
                      movie.directors.map((director, i) => `${i > 0 ? ', ' : ''}${director.name}`)
                      : '-'}
                </List.Item>
                <List.Item key={`movie-actors`} index={5}>
                  <strong>Actors </strong>
                    {movie.actors.length > 0 ?
                      movie.actors.map((actor, i) => `${i > 0 ? ', ' : ''}${actor.name}`)
                      : '-'}
                </List.Item>
                <List.Item key={`movie-gross`} index={6}>
                  <strong>Gross</strong> {movie.gross ?? '-'}
                </List.Item>
              </List>
            )
        }
        return <></>
    }

    return (
        <Container>
            <Content className='p-6'>
                <div className='flex'>
                    <Icon icon="close" size="3x" onClick={() => history.goBack()} style={{ marginRight: 16 }} />
                    <Searchbar style={{ flex: 1 }} />
                </div>
                <Grid fluid style={{ marginTop: 64 }}>
                  {movie &&
                    <Row>
                        <Col xs={24} md={6} lg={4} mdOffset={1} lgOffset={2} className='text-center'>
                            <Panel shaded bodyFill style={{ maxWidth: 300 }}>
                                <img src={`${movie.picture}`} style={{ width: '100%' }} alt='Movie poster' />
                            </Panel>
                        </Col>

                        <Col xs={24} md={15} lg={15} mdOffset={1}>
                            <h1>{movie.title}</h1>
                            {genres &&
                              <TagList tags={genres} renderTag={(tag) => tag} />
                            }

                            <div className='flex flex-align-center' style={{ marginTop: 24 }}>
                                <div className='text-center'>
                                    <h4>{movie.rating} / 10</h4>
                                    <Rate readOnly={true} max={10} allowHalf={true} value={movie.rating} />
                                </div>
                                <div className='text-center' style={{ marginLeft: 64 }}>
                                    <Icon icon='clock-o' size='2x' />
                                    <h4 style={{ textAlign: 'start', verticalAlign: 'middle' }}>{movie.runtime} minutes</h4>
                                </div>
                            </div>
                            <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} style={{ marginTop: 32 }}>
                                <Nav.Item eventKey="overview"><h5>Overview</h5></Nav.Item>
                                <Nav.Item eventKey="trailer"><h5>Trailer</h5></Nav.Item>
                                <Nav.Item eventKey="details"><h5>Details</h5></Nav.Item>
                            </Nav>
                            <Panel shaded>
                                {renderTabs()}
                            </Panel>
                            <div className='flex' style={{ marginTop: 16 }}>
                                <Button color='yellow' appearance='ghost'>
                                    <Icon icon='heart-o' /> Add to favorites
                                </Button>
                                <Button appearance='ghost' style={{ marginLeft: 16 }}>
                                    <Icon icon='list' /> Add to playlist
                                </Button>
                            </div>
                        </Col>
                    </Row>
                  }
                  {/*
                    <Row style={{ marginTop: 32 }}>
                        <Col xs={24} md={22} lg={20} mdOffset={1} lgOffset={2}>
                            <h3 className='text-center'>Reviews</h3>
                            <Row>
                                {Array(10).fill(0).map((_, idx) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                                        <Panel shaded bordered header={
                                            <div className='flex flex-align-center'>
                                                <Avatar
                                                    circle
                                                    src="https://avatars2.githubusercontent.com/u/12592949?s=460&v=4"
                                                />
                                                <span style={{ marginLeft: 12 }}>Jean dupont</span>
                                            </div>
                                        } style={{ margin: 12 }}>
                                            <PlaceholderParagraph />
                                        </Panel>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                  */}
                </Grid>
            </Content>
        </Container>
    );
}
