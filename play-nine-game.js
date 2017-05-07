var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};
const Stars = (props) => {
	
  return (
  	<div className='col-5'>
  		{_.range(props.numberOfStars).map((i) => <i key={i} className='fa fa-star'></i>)}
    </div>
  );
}
const Button = (props) => {
	let button;
  switch(props.answerIsTrue) {
  	case true: 
    	button = 
  			<button className='btn btn-success' onClick={props.acceptAnswer}>
        	<i className='fa fa-check'></i>
        </button>;
    		break;
    case false:
    	button = 
  			<button className='btn btn-danger'>
        	<i className='fa fa-times'></i>
        </button>;
    		break;
    default: 
    	button = 
  			<button className='btn' onClick={() => props.checkAnswer()} disabled={props.selectedNumbers.length === 0}>
          =
          </button>;
    		break;
    }
    return (
    	<div className='col-2'>
      	{button}
        <br /> <br />
        <button className='btn btn-warning btn-sm' onClick={props.redraw} 
        	disabled={props.redraws === 0}><i className='fa fa-refresh'></i>{props.redraws}</button>
      </div>
    );
}
const Answer = (props) => {
	return (
  	<div className='col-5'>
  		{props.selectedNumbers.map((num, i)=> <span key={i} onClick={() => props.removeNumber(num)}>{num}</span>)}
    </div>
  );
}
const Numbers= (props) => {
  const checkSelected = (num) => {
  	if(props.usedNumbers.indexOf(num) >= 0)
    	return 'used';
  	if(props.selectedNumbers.indexOf(num) >= 0)
    	return 'selected';
  };
  	return (
    <div className='card text-center'>
    	<div>
      	{_.range(1, 10).map((i) => <span className={checkSelected(i)} onClick={() => props.selectNumber(i)} key={i}>{i}</span>)}
      </div>
    </div>
    );
}
const DoneFrame = (props) => {
	return (
  	<div className='text-center'>
    	<h2>{props.doneStatus}</h2>
      <button className='btn btn-secondary' onClick={props.reset}>Play Again!</button>
    </div>
  );
};
class Game extends React.Component {
    static randomStars = () => 1 + Math.floor(Math.random() * 9);
    static gameInitialState = () => ({
			selectedNumbers: [],
      usedNumbers: [],
      answerIsTrue:  null,
      redraws: 5,
      doneStatus: null,
    	numberOfStars: Game.randomStars()
    });
	state = Game.gameInitialState();
  resetGame = () => this.setState(Game.gameInitialState());
  selectNumber = (num) => {
  	if (this.state.usedNumbers.indexOf(num) >= 0) { return; }
    if (this.state.selectedNumbers.indexOf(num) >= 0) { return; }
  	this.setState(prevState => ({
    	answerIsTrue: null,
    	selectedNumbers: prevState.selectedNumbers.concat(num)
    }));
  };
  removeNumber = (num) => {
  	this.setState(prevState => ({
    	answerIsTrue: null,
    	selectedNumbers: prevState.selectedNumbers.filter(i => i !== num)
    }));
  };	
  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsTrue: prevState.numberOfStars === prevState.selectedNumbers.reduce((a, b) => a + b, 0)
    }));
  }
  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      numberOfStars: Game.randomStars(),
      answerIsTrue: null
    }), this.changeDoneStatus);
  }
  redraw = () => {
  if(this.state.redraws === 0) return;
  	this.setState(prevState => ({
    	answerIsTrue: null,
      numberOfStars: Game.randomStars(),
      selectedNumbers: [],
    	redraws: prevState.redraws - 1
    }), this.changeDoneStatus);
  };
  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
		const possibleNumbers = _.range(1, 10).filter(number => 
    	usedNumbers.indexOf(number) === -1
    );
    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };
  changeDoneStatus = () => {
  	this.setState(prevState => {
    	if(prevState.usedNumbers.length === 9)
      	return { doneStatus: 'You Win!'};
        if(prevState.redraws === 0 && !this.possibleSolutions(prevState))
      	return { doneStatus: 'You Lose!'};
    });
  }
  render() {
  	const {selectedNumbers, numberOfStars, answerIsTrue, usedNumbers, redraws, doneStatus} = this.state;
  	return (
    	<div className='container'>
      	<div className='row'>
        	<Stars numberOfStars={numberOfStars}/>
        	<Button checkAnswer={this.checkAnswer} 
          answerIsTrue={answerIsTrue}
          selectedNumbers={selectedNumbers}
          acceptAnswer={this.acceptAnswer}
          redraws={redraws}
          redraw={this.redraw}/>
        	<Answer selectedNumbers={selectedNumbers}
          	removeNumber={this.removeNumber} 
            redraws={redraws}/>
        </div>
        <br />
        {doneStatus ?
        	<DoneFrame doneStatus={doneStatus} reset={this.resetGame}/> : 
          <Numbers selectedNumbers={selectedNumbers} selectNumber={this.selectNumber} usedNumbers={usedNumbers}/> 
        }
        
      </div>
    );
  }
}

ReactDOM.render(<Game />, mountNode);
