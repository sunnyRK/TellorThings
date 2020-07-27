import React from 'react';
import Headers from './CommonHeader';
import Head from 'next/head';
import { Container, List, Header, Grid, Segment} from 'semantic-ui-react';

export default props => {
    
    return(
        <div>
            <Head>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"></link>
                <link rel="stylesheet" href="/static/styles.css"></link>
                {/* <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet"> */}
                {/* <style>
                    @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
                </style>
                <link rel="stylesheet" href="/static/style.css"></link> */}
            </Head>
            <Headers/>
            {props.children}
            <Segment inverted vertical style={{ padding: '4em 4em', marginTop: "30px" }}>
                    <Container> 
                    <Grid divided inverted stackable>
                        <Grid.Row >
                        <Grid.Column width={4}>
                            <Header inverted as='h4' content='About'/>
                            <List link inverted >
                            <List.Item as='a'><a href="https://www.linkedin.com/in/sunnyradadiya/" target="_blank">LinkedIn</a></List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Header inverted as='h4' content='Contact Us' />
                            <List link inverted>
                            <List.Item as='a'>radadiyasunny970@gmail.com</List.Item>
                            <List.Item as='a'>+91 - 99090 97776</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Header as='h4' inverted>
                            Location
                            </Header>
                            <p>
                            Bengaluru, India
                            </p>
                        </Grid.Column>
                        
                        <Grid.Column width={5}>
                            <Header as='h4' inverted>
                            Developed During ChainRunner Hackathon
                            </Header>
                            <p>
                            Tellor Oracle and Uniswap-V2 protocol used.
                            </p>
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    </Container>
                </Segment>
        </div>
    );
};