import React from 'react';

import { Jumbotron, Container, Row, Col  } from 'reactstrap';
import FontInputForm from './FontInputForm';
import FontConstantCalculator from './FontConstantCalculator';

import './style.scss';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState() {
		return {
			calculationInProgressCount: 0,
			formInputs: {
				asciiStartIndex: 0,
				asciiEndIndex: 0
			},
			calculatedCharConstants: {}
		}
	}

	startCalculation(formInputs) {
		this.setState({formInputs, calculationInProgressCount: (formInputs.asciiEndIndex - formInputs.asciiStartIndex + 1) });
	}

	setCharConstant(charCode, fontConstant) {
		const {calculatedCharConstants, formInputs, calculationInProgressCount} = this.state;

		this.setState({calculatedCharConstants: Object.assign(this.state.calculatedCharConstants, {[charCode]: fontConstant}), calculationInProgressCount: this.state.calculationInProgressCount - 1});
	}

	clearCalculation() {
		this.setState(this.getInitialState());
	}

	renderCalculators() {
		const {formInputs} = this.state;
		const asciiStartIndex = formInputs.asciiStartIndex;
		const asciiEndIndex = formInputs.asciiEndIndex;
		const calcRows = [];
		for(let i = asciiStartIndex; i <= asciiEndIndex; i++) {
			calcRows.push(
				<Row>
					<Col xs='12'>
						<FontConstantCalculator {...formInputs} characterCode={i} onCalculationCompleted={(charCode, fontConstant) => this.setCharConstant(charCode, fontConstant)}/>
					</Col>
				</Row>
			)
		}
		return calcRows;
	}

	render() {
		const {formInputs, calculationInProgressCount, calculatedCharConstants} = this.state

		return (
			<Container>
				<Row>
					<Col xs='12'>
						<Jumbotron>
							<h1 className='display-3'>Simple Font Constant Calculator</h1>
							<p className='lead'>This is a simple font constant calculator. With given details, 
							you can easily get calculated font constants for each characters</p>
							<p className='lead'>After calculation, you can also get average value over all characters and able to download result JSON object.</p>
							<hr className='my-2' />
							<p>It uses ASCII character values set from #32 to #126. Later on planning to support for unicode range.</p>
						</Jumbotron>
					</Col>
				</Row>
				<Row>
					<Col xs='12' sm='6'>
						<FontInputForm 
							onFormClear={() => this.clearCalculation()}
							onFormSubmit={(inputs) => this.startCalculation(inputs)}
							disabled={calculationInProgressCount !== 0}
							showClear={calculationInProgressCount !== 0 || Object.keys(calculatedCharConstants).length}/>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} style={{textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', padding: '20px'}}>
						{ (calculationInProgressCount === 0 && Object.keys(calculatedCharConstants).length) ?  <a download={'calculated-font-contants-result.json'} class={'btn btn-success'}  href={`data:application/json;charset=utf-8;,${encodeURIComponent(JSON.stringify(calculatedCharConstants))}`}  target={'_blank'}>Download Result</a> : null}
					</Col> 
				</Row>
				<Row>
					<Col xs={12} sm={12} style={{textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', padding: '20px', paddingBottom: '40px'}}>
						{calculationInProgressCount === 0 && Object.keys(calculatedCharConstants).length
							 ? `Average Font Constant Value: ${(Object.keys(calculatedCharConstants).map((key) => calculatedCharConstants[key]).reduce((a,b) => a + b, 0) / Object.keys(calculatedCharConstants).length)}` : ''}
					</Col>
				</Row>
				{ calculationInProgressCount || Object.keys(calculatedCharConstants).length ? this.renderCalculators() : null }
			</Container>
		);
	}

}