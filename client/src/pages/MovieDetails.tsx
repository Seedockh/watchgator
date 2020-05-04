import React, { CSSProperties, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Icon, Content, Grid, Row, Col, Panel, Nav, Button, Rate, List, Loader } from 'rsuite'
import { TagList } from '../widget/TagList'
import { Searchbar } from '../widget/Searchbar'
import { addPictureUrlSize } from '../utils/movieUtils'
import { ActorAvatar } from '../widget/ActorAvatar'
import { Movie } from '../models/api/Movie'
import { Actor } from '../models/api/Actor'

const detailKeysStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between'
}

export const MovieDetails = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [movie, setMovie] = useState<Movie>()
  const [peoples, setPeoples] = useState<Actor[]>([])
  const history = useHistory()

  useEffect(() => {
    // @ts-ignore
    if (history.location.state) {
      // @ts-ignore
      setMovie(history.location.state.movie)
    } else {
      fetchMovie()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history])

  useEffect(() => {
    if (movie) {
      fetchActors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie])

  const fetchMovie = async () => {
    if (history && movie === null) {
      fetch(`${process.env.REACT_APP_API_URI}/movies/${window.location.href.split('/')[4]}`)
        .then(response => response.json())
        .then(setMovie)
        .catch(error => console.log(error))
    }
  }

  const fetchActors = async () => {
    let movieActors: Actor[] = []

    if (movie && movie.actors) {
      const getActors = movie.actors!.map((actor, index) => {
        return fetch(`${process.env.REACT_APP_API_URI}/peoples/${actor.id}`)
          .then(response => response.json())
          .then(apiActor => movieActors.push(apiActor))
          .catch(error => console.log(error))
      })

      Promise.all(getActors).then(() => {
        setPeoples(movieActors)
      })
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
      return <List>
        <List.Item key={`movie-year`} index={0} style={detailKeysStyle}>
          <strong>Year</strong>
          <p>{movie.year ?? '-'}</p>
        </List.Item>
        <List.Item key={`movie-nbRatings`} index={1} style={detailKeysStyle}>
          <strong>People critics</strong>
          <p>{movie.nbRatings ?? '0'}</p>
        </List.Item>
        <List.Item key={`movie-metaScore`} index={2} style={detailKeysStyle}>
          <strong>MetaScore</strong>
          <p>{movie.metaScore ?? '-'}</p>
        </List.Item>
        <List.Item key={`movie-certificate`} index={3} style={detailKeysStyle}>
          <strong>Certificate</strong>
          <p>{movie.certificate ?? '-'}</p>
        </List.Item>
        <List.Item key={`movie-directors`} index={4} style={detailKeysStyle}>
          <strong>Directors</strong>
          <p>
            {movie.directors.length > 0
              ? movie.directors.map(({ name }) => name).join(', ')
              : '-'
            }
          </p>
        </List.Item>
        <List.Item key={`movie-actors`} index={5} style={detailKeysStyle}>
          <strong>Actors</strong>
          <p>
            {movie.actors.length > 0
              ? movie.actors.map(({ name }) => name).join(', ')
              : '-'
            }
          </p>
        </List.Item>
        <List.Item key={`movie-gross`} index={6} style={detailKeysStyle}>
          <strong>Gross</strong>
          <p>{movie.gross ?? '-'}</p>
        </List.Item>
      </List>
    }
    return <></>
  }

  return (
    <Container>
      <Content className='p-6'>
        <div className='flex'>
          <Icon icon="close" size="3x" onClick={history.goBack} style={{ marginRight: 16 }} />
          <Searchbar style={{ flex: 1 }} />
        </div>
        <Grid fluid style={{ marginTop: 64 }}>
          {!movie &&
            <Row>
              <Col xs={24} md={6} lg={4} mdOffset={1} lgOffset={2} className='text-center'>
                <Loader size="lg" content="Loading ..." />
              </Col>
            </Row>
          }
          {movie &&
            <Row>
              <Col xs={24} md={6} lg={4} mdOffset={1} lgOffset={2} className='text-center'>
                <Panel shaded bodyFill style={{ maxWidth: 300 }}>
                  <img src={addPictureUrlSize(movie.picture, 1300)} style={{ width: '100%' }} alt='Movie poster' />
                </Panel>
              </Col>

              <Col xs={24} md={15} lg={15} mdOffset={1}>
                <h1>{movie.title}</h1>
                {movie.genres && <TagList tags={movie.genres} renderTag={(tag) => tag.name} />}

                <div className='flex flex-align-center' style={{ marginTop: 24 }}>
                  <div className='text-center'>
                    <h4>{movie.rating} / 10</h4>
                    <Rate readOnly={true} max={10} allowHalf={true} value={movie.rating ?? 0} />
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
          {peoples.length > 0 &&
            <Row style={{ marginTop: 32 }}>
              <Col xs={24} md={22} lg={20} mdOffset={1} lgOffset={2}>
                <h3 className='text-center'>Actors</h3>
                <Row>
                  {peoples.map((actor, idx) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                      <Panel shaded bordered className='text-center'>
                        <ActorAvatar actor={actor} size={100} style={{ marginLeft: 'auto', marginRight: 'auto'}} />
                        <Panel bodyFill className='mt-3'> 
                          <h6>{actor.firstname} {actor.lastname}</h6>
                          <small>{actor.role}</small>
                        </Panel>
                      </Panel>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          }
        </Grid>
      </Content>
    </Container>
  );
}
