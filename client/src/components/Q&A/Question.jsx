import React from 'react';
import Answers from './Answers.jsx';
import styled from 'styled-components';
import axios from 'axios';
import AnswerModal from './AnswerModal.jsx';

const ContainerA = styled.div`
  border-top: 0px solid grey;
  border-radius: 12px;
  margin: 12px;
  padding: 0px 20px 0px 20px;
  width: 100%;
  display: block;
`;
const EachQ = styled.div`
  display: flex;
  flex-direction: row;
`;

const MoveRight = styled.div`
  margin-left: auto;
  display: flex;
  float: right;
`;
const ContainerB = styled.div`
  padding: 10px;
  border-top: 1px grey solid;
  margin: 3px;
`;
const Button = styled.button`
  text-decoration: underline;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  &:hover {
    text-decoration: none;

`;

const LoadButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;

`;

const Divide = styled.span`
  margin-left: 5px;
  margin-right: 5px;
  padding-top: 17.5px;

  display: flex;
`;

const ScrollList = styled.ul`
  list-style:none;
  max-height:350px;
  margin:0;
  overflow:auto;
  padding:0;
  text-indent:10px;
`;

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      loadedState: false,
      modal: false,
      itemsToShow: 2,
      expanded: false,
      helpful: this.props.item.question_helpfulness,
      clickedYes: false
    };
    this.selectModal = this.selectModal.bind(this);
    this.showMore = this.showMore.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.oldRender = this.oldRender.bind(this);
  }

  componentDidMount() {
    const { item } = this.props;
    const object = item.answers;
    if (object.length <= 1) {
      this.setState({
        answers: Object.values(object).sort((a, b) => b.helpfulness - a.helpfulness)
      });
    } else {
      this.setState({
        answers: Object.values(object).sort((a, b) => b.helpfulness - a.helpfulness)
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { item } = this.props;
    if (prevProps.item.id !== item.id) {
      this.oldRender();
    }
  }

  handleClick(event) {
    const { item } = this.props;
    console.log('Event = ', event.target.name);
   // console.log()
    if (!this.state.clickedYes && event.target.name === 'helpful') {
      axios.put(`/api/qa/questions/${item.question_id}/helpful`
        // question_id: item.question_id,
        // type: event.target.name,
    )
        .then((response) => {
          console.log(response);
          this.setState({
            helpful: this.state.helpful + 1,
            clickedYes: true,
          });
        });
    } else {
      axios.put(`/api/qa/questions/${item.question_id}/report`
        // question_id: item.question_id,
         //type: event.target.name,
      )
        .then(() => {
          this.setState({
            clickedReport: true,
          });
        });
    }
  }

  selectModal() {
    const {
      modal,
    } = this.state;
    this.setState({
      modal: !modal, // toggle
    });
  }

  showMore() {
    const {
      itemsToShow, answers,
    } = this.state;
    itemsToShow === 2 ? (this.setState({
      itemsToShow: answers.length,
      expanded: true,
    })) : (this.setState({
      itemsToShow: 2,
      expanded: false,
    }));
  }

  oldRender() {
    const { item } = this.props;
    const object = item.answers;
    if (object.length <= 1) {
      this.setState({
        answers: Object.values(object).sort((a, b) => b.helpfulness - a.helpfulness),
        loadedState: true,
      });
    } else {
      this.setState({
        answers: Object.values(object).sort((a, b) => b.helpfulness - a.helpfulness),
        loadedState: true,
      });
    }
  }

  render() {
    const {
      loadedState, itemsToShow, answers, expanded, modal, helpful, clickedReport
    } = this.state;
    const { item } = this.props;
    // if (!loadedState) {
    //   return (
    //     null
    //   );
    // }
    return (
      <ContainerA>
        <EachQ>
          <h3>
            Question :
            {' '}
            {this.props.item.question_body}
          </h3>
          <MoveRight>
            <p> Helpful? </p>
            <Button name="helpful" onClick={(event) => { event.preventDefault(); this.handleClick(event); }}> Yes </Button>
            <p>
              (
              {helpful}
              )
            </p>
            <Divide className="divider"> | </Divide>
            {!clickedReport ? (<Button name="report" onClick={(event) => { event.preventDefault(); this.handleClick(event); }}> Report </Button>) : (<p>Reported</p>)}
            <Divide className="divider"> | </Divide>
            <Button className="addAButton" onClick={this.selectModal}> Add Answer </Button>
          </MoveRight>
        </EachQ>
        <div>
          {itemsToShow <= 2 ? (
            <div>
              {answers.slice(0, itemsToShow).map((answer, i) => (
                <ContainerB key={i}>
                  <Answers item={answer} seller={item.asker_name} reportItem={item.reported} />
                </ContainerB>
              ))}
            </div>
          ) : (
            <ScrollList>
              {answers.slice(0, itemsToShow).map((answer) => (
                <ContainerB key={answer.answer_id}>
                  <Answers item={answer} seller={item.asker_name} reportItem={item.reported} />
                </ContainerB>
              ))}
            </ScrollList>
          )}

          {answers.length > 2
            ? (
              <div>
                {(!expanded) ? (
                  <LoadButton onClick={() => { this.showMore(); }}> LOAD MORE ANSWERS </LoadButton>
                ) : (
                  <LoadButton onClick={() => { this.showMore(); }}> Collapse List </LoadButton>
                )}
              </div>
            ) : (null)}

        </div>
        <AnswerModal displayModal={modal} closeModal={this.selectModal} q_id={item.question_id} />
      </ContainerA>
    );
  }
}

export default Question;