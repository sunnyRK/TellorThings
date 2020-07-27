import React from 'react';
import {
  Container, List, Header,
  Grid, Segment,
} from 'semantic-ui-react';

import LinkedInIcon from '../../../assets/icons/linkedin.svg';

const MainTemplate = ({ children }) => (
  <div className="main-template">
    <div className="main-header">
      <div className="app-name">Instcrypt</div>
    </div>
    <div className="main-content">
      {children}
    </div>
    <div className="main-footer">
      <Segment inverted vertical className="app-footer">
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={4}>
                <Header inverted as="h4" content="About Us" />
                <List link inverted>
                  <List.Item as="a">Sunny Radadiya <a href="https://www.linkedin.com/in/sunnyradadiya/" target="_blank"><img src={LinkedInIcon} className="ui avatar image" alt="coin" /></a></List.Item>
                  <List.Item as="a">Rajat Beladiya <a href="https://www.linkedin.com/in/rajat-b-17695a116/" target="_blank"><img src={LinkedInIcon} className="ui avatar image" alt="coin" /></a></List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={4}>
                <Header inverted as="h4" content="Contact Us" />
                <List link inverted>
                  <List.Item as="a" href="mailto:radadiyasunny970@gmail.com">radadiyasunny970@gmail.com</List.Item>
                  <List.Item as="a" href="mailto:rajatbeladiya7@gmail.com">rajatbeladiya7@gmail.com</List.Item>
                </List>
              </Grid.Column>

              <Grid.Column width={5}>
                <Header as="h4" inverted>
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
  </div>
);

export default MainTemplate;
