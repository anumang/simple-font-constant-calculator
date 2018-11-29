import React from 'react';

import { Jumbotron, Container, Row, Col  } from 'reactstrap';
import FontInputForm from './FontInputForm';
import FontConstantCalculator from './FontConstantCalculator';

import './style.scss';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			calculationInProgress: false,
			formInputs: {}
		}
	}

	startCalculation(formInputs) {
		this.setState({formInputs, calculationInProgress: true });
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
						<FontConstantCalculator {...formInputs} characterCode={i}/>
					</Col>
				</Row>
			)
		}
		return calcRows;
	}

	render() {
		const {formInputs, calculationInProgress} = this.state
		return (
			<Container>
				<Row>
					<Col xs='12'>
						<Jumbotron>
							<h1 className='display-3'>Simple Font Constant Calculator</h1>
							<p className='lead'>This is a simple font constant calculator with font family, font size and optional character set inputs. 
							You can easily get font constants for each chars and result of average font constant value.</p>
							<hr className='my-2' />
							<p>It uses default ASCII character set from #33 to #126. Optionally you can give your char set for calculation.</p>
						</Jumbotron>
					</Col>
				</Row>
				<Row>
					<Col xs='12' sm='6'>
						<FontInputForm  onFormSubmit={(inputs) => this.startCalculation(inputs)} disabled={calculationInProgress}/>
					</Col>
				</Row>
				{ calculationInProgress ? this.renderCalculators() : null }
			</Container>
		);
	}

}