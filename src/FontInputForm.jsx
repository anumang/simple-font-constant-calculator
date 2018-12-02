import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, FormGroup, Label, Input, FormText, Row, Col, FormFeedback } from 'reactstrap';

export default class FontInputForm extends React.Component {

	static propTypes = {
		onFormSubmit: PropTypes.func,
		showClear: PropTypes.bool,
		disabled: PropTypes.bool
	}

	constructor(props) {
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState() {
		return {
			fontFamily: 'Arial',
			fontSize: 25,
			fontUnit: 'px',
			asciiStartIndex: 32,
			asciiEndIndex: 126,
		}
	}

	setFormValue(field, value) {
		if(value.target) {
			this.setState({[field]: value.target.value});
		} else {
			this.setState({[field]: value});
		}
	}

	onFormSubmit() {
		const {onFormSubmit} = this.props;
		if(onFormSubmit && typeof onFormSubmit === 'function') {
			onFormSubmit(this.state);
		}
	}

	onFormClear() {
		const {onFormClear} = this.props;
		if(onFormClear && typeof onFormClear === 'function') {
			onFormClear();
		}
		this.setState(this.getInitialState());	
	}

	render() {
		const {disabled, showClear} = this.props;
		const {asciiStartIndex, asciiEndIndex} = this.state;

		return (
			<Form>
				<FormGroup disabled={disabled}>
					<legend for='fontFamily'>Font Family</legend>
					<Input invalid={this.state.fontFamily.length === 0} type='text' name='font' id='fontFamily' placeholder='Enter font family such as Arial Roboto ...' onChange={(value) => this.setFormValue('fontFamily', value)} value={this.state.fontFamily}/>
					<FormFeedback>FontFamily should not be empty!</FormFeedback>
				</FormGroup>
				<FormGroup disabled={disabled}>
					<legend for='fontSize'>Font Size</legend>
					<Input  invalid={this.state.fontSize <= 0}  min={0} type='number' name='font' id='fontSize' placeholder='Font size such as 25 15 ...'  onChange={(value) => this.setFormValue('fontSize', value)}  value={this.state.fontSize}/>
					<FormFeedback>FontSize should be valid positive integer!</FormFeedback>
				</FormGroup>
				<FormGroup fieldset>
					<legend>Font Size Unit</legend>
					<FormGroup check disabled={disabled}>
						<Label check>
							<Input type='radio' name='formUnit' onChange={() => this.setFormValue('fontUnit', 'px')} checked={this.state.fontUnit === 'px'} />
							{' px'}
						</Label>
					</FormGroup>
					<FormGroup check disabled={disabled}>
						<Label check>
							<Input type='radio' name='formUnit'  onChange={() => this.setFormValue('fontUnit', 'rem')} checked={this.state.fontUnit === 'rem'} />
							{' rem'}
						</Label>
					</FormGroup>
				</FormGroup>
				<FormGroup>
					<legend for="asciiRanges" >ASCII Range</legend>
					<FormGroup row>
						<Col xs={6}>
							<Input type="number" name="asciiStart" id="asciiStart" placeholder="Character start index" value={asciiStartIndex} disabled/>
						</Col>
						<Col xs={6}>
							<Input type="number" name="asciiEnd" id="asciiEnd" placeholder="Character end index"  value={asciiEndIndex} disabled/>
						</Col>
					</FormGroup>
				</FormGroup>
				<Row>
					<Col xs={6} sm={4}>
						<Button color="primary" disabled={disabled || this.state.fontSize <= 0 || this.state.fontFamily.length === 0} onClick={() => this.onFormSubmit()}>{disabled ? 'Calculating...' :'Start Calculation'}</Button>
					</Col>
					<Col xs={6} sm={4}>
						{showClear ? <Button color="warning" disabled={disabled || this.state.fontSize <= 0 || this.state.fontFamily.length === 0} onClick={() => this.onFormClear()}>Clear</Button> : null}
					</Col>
				</Row>
			</Form>
		);
	}

}