import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import logo from './images/Similirillion.svg';
import instructionBG from './images/instructionBG.svg';
import logoSplash from './images/logoSplash.svg';
import correctFeedback from './images/correctFeedback.js';
import incorrectFeedback from './images/incorrectFeedback.js';
import wonEmoji from './images/wonEmoji.js';
import lostEmoji from './images/lostEmoji.js';
import './App.css';
import Sentences from './components/sentences.js';
import 'confetti-js';
import 'typeface-muli';

/* Main Game State */
const Game = (props) => {
  return(
    <div className="Game">
      {props.numLeft > 0 ? (
        <div className="game-container">
          <Header />
          <GameQuestion sentence={props.currentSentence} />
          {props.questionAnswered ? (
              <GameFeedback 
                sentence={props.currentSentence} 
                isCorrect={props.currentIsCorrect} 
                nextQuestion={props.nextQuestion} />
            ) : (
              <div className="button-container container">
                <GameButton buttonText="Simile" handleAnswer={() => {props.handleAnswer(props.currentSentence, 'simile')}} />
                <GameButton buttonText="Metaphor" handleAnswer={() => {props.handleAnswer(props.currentSentence, 'metaphor')}} />
              </div>
            )}
            <Score 
              numCorrect={props.numCorrect}
              numQuestions={props.numQuestions} />
        </div>
      ) : (
        <div className="game-container">
          <Header />
          <EndState
            numCorrect={props.numCorrect}
            numQuestions={props.numQuestions}
            handleRestart={props.handleRestart} />
        </div>
      )}
      
    </div>
  )
}

const Header = () => {
  return(
    <header className="header container">
      <div className="logo">
        <img src={logo} className="App-logo" alt="Similirillion" />
      </div>
      <button className="help">?</button>
    </header>
  )
}

const GameQuestion = (props) => {
  return (
    <div>
      <h1 className="main-question">Is this a <span className="underline">S</span>imile or a <span className="underline">M</span>etaphor?</h1>
      <p className="sentence">{props.sentence.sentence}</p>
    </div>
  )
}

const GameFeedback = (props) => {
  return (
    <div>
      <img className="feedback-image" src={props.isCorrect ? correctFeedback : incorrectFeedback } alt="feedback" />
      <p className="feedback">{props.sentence.feedback}</p>
      <ContinueButton nextQuestion={props.nextQuestion} />
    </div>
  )
}

const GameButton = (props) => {
  return(
    <button className="game-button" onClick={props.handleAnswer}>{props.buttonText}</button>
  );
}

const ContinueButton = (props) => {
  // console.log(props.nextQuestion)
  return(
    <button className="game-button" onClick={props.nextQuestion}>Continue</button>
  );
}

const Score = (props) => {
  return (
    <p className="score">{props.numCorrect} / {props.numQuestions}</p>
  )
}

class EndState extends Component {
  constructor(props) {
    super(props);
    this.goodScore = this.props.numCorrect > Math.floor(this.props.numQuestions * (8 / 10));
    this.confettiSettings = { target: 'confetti-canvas' };
    this.confetti = new window.ConfettiGenerator(this.confettiSettings);
  }

  componentDidMount() {
    if (this.goodScore) {
      this.confetti.render();
    }
  }

  componentWillUnmount() {
    this.confetti.clear();
  }

  render() {
    return (
      <div>
        <h1>{this.goodScore ? "Well Done!" : "Oh no!"}</h1>
        <img className="feedback-image" src={this.goodScore ? wonEmoji: lostEmoji } alt="feedback" />
        <p>You scored {this.props.numCorrect} out of {this.props.numQuestions}</p>
        <button className="game-button" onClick={this.props.handleRestart}>Play again?</button>
      </div>
    );
  }
}

const InstructionScreen = (props) => {
  return (
      <Fade opposite>
      <div className="instructions">
        <div className="game-container">
          <h1>Does trying to untangle Similes and Metaphors leave you feeling thin, like butter scraped over too much bread?</h1>
          <p>In this game, we’ve prepared 10 sentences for you to test your skills by choosing whether you think they are examples of similes or metaphors.</p>
          <button className="game-button" onClick={props.goToGame}>Let's Play</button>
        </div>
        <img className="instruction-bg" src={instructionBG} alt="" />
      </div>
    </Fade>
  )
}

class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.nextScreen = setTimeout(this.props.goToInstructions, 7000);
  }

  componentWillUnmount() {
    clearInterval(this.nextScreen);
  }

  render() {
    return(

      <div className="overlay">
        <img className="splash-logo fade-in" src={logoSplash} alt="Similirillion" />
      </div>
    );
  }
}

const About = (props) => {
  return(
    <div className="about">
      <h1>About this game</h1>
      <p>A tiny, responsive game made in ReactJS</p>
    </div>
  )
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameStarted: false,
      seeInstructionScreen: false,
      currentSentence: {},
      sentences: Sentences,
      numQuestions: 10,
      numCorrect: 0,
      numLeft: 10,
      questionAnswered: false,
      currentIsCorrect: false,
      allowKeyPress: false,
    }
    this.handleAnswer = this.handleAnswer.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.goToInstructions = this.goToInstructions.bind(this);
    this.goToGame = this.goToGame.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  getRandomSentence() {
    // Get random question from copy of sentences arr
    // Delete the question from the copy so it can't be asked again
    //console.log(this.state);

    const sentence = this.state.sentences[
      Math.floor(Math.random() * this.state.sentences.length)
    ];
    const index = this.state.sentences.indexOf(sentence);
    const newArray = this.state.sentences.slice(0);
    newArray.splice(index, 1);

    this.setState({
      currentSentence: sentence,
      sentences: newArray,
      allowKeyPress: true,
    });
  }

  nextQuestion() {
    this.setState({
      ...this.state,
      questionAnswered: false,
      currentIsCorrect: false,
    });

    this.getRandomSentence();
  }

  componentWillMount() {
    //let currentSentence = this.getRandomSentence();
    //console.log(currentSentence)
    window.addEventListener('keydown', this.handleKeyPress, this);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleAnswer(sentence, chosen) {

    //console.log(this.state.numLeft)
    if(this.state.numLeft > 0) {
      this.setState({
        numLeft: this.state.numLeft - 1,
      });
      let answer = sentence.type;
      let isCorrect = false;

      if(chosen === 'simile' && answer === 'simile') {
        isCorrect = true;
        this.setState({
          numCorrect: this.state.numCorrect + 1
        });
      } else if (chosen === 'metaphor' && answer === 'metaphor') {
        isCorrect = true;
        this.setState({
          numCorrect: this.state.numCorrect + 1
        });
      }

      this.setState({
        questionAnswered: true,
        currentIsCorrect: isCorrect
      });
    } else {
      this.setState({
        isGameStarted: false
      });
    }
  }

  handleRestart() {
    this.setState({
      isGameStarted: false,
      seeInstructionScreen: true,
      numQuestions: 10,
      numCorrect: 0,
      numLeft: 10,
      sentences: Sentences.slice(0),
      currentQuestion: {},
      questionAnswered: false,
      currentIsCorrect: false,
      allowKeyPress: false
    });
  }

  goToInstructions() {
    this.nextQuestion();
    this.setState({
      seeInstructionScreen: true
    });
    //console.log("Go to instructions screen");
  }

  goToGame() {
    this.setState({
      seeInstructionScreen: false,
      isGameStarted: true,
    })
  }

  handleKeyPress(e) {
    const key = e.key.toUpperCase();
    console.log(this.state.allowKeyPress)
    let type = "";
    if(this.state.isGameStarted && this.state.allowKeyPress) {
      if(key === "S") {
        type = "simile";
      } else if (key === "M") {
        type = "metaphor";
      }
      this.handleAnswer(this.state.currentSentence, type);
      this.setState({
        allowKeyPress: false,
      });
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.isGameStarted ? (
          <Fade opposite>
            <div className="full-height">
              <canvas id="confetti-canvas"></canvas>
              <Game 
                currentSentence={this.state.currentSentence} 
                handleAnswer={this.handleAnswer} 
                currentIsCorrect={this.state.currentIsCorrect}
                questionAnswered={this.state.questionAnswered}
                nextQuestion={this.nextQuestion}
                numCorrect={this.state.numCorrect}
                numQuestions={this.state.numQuestions}
                numLeft={this.state.numLeft}
                handleRestart={this.handleRestart} />
              </div>
            </Fade>
          ) : this.state.seeInstructionScreen ? (
            <InstructionScreen goToGame={this.goToGame} />
          ) : (
              <SplashScreen goToInstructions={this.goToInstructions} />
          )
        }
      </div>
    );
  }
}

export default App;
