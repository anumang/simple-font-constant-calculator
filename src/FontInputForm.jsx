import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';

export default class FontInputForm extends React.Component {

	static propTypes = {
		onFormSubmit: PropTypes.func,
		disabled: PropTypes.bool
	}

	constructor(props) {
		super(props);
		this.state = {
			fontFamily: 'Arial',
			fontSize: 25,
			fontUnit: 'px',
			asciiStartIndex: 33,
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

	render() {
		const {disabled} = this.props;
		const {asciiStartIndex, asciiEndIndex} = this.state;

		return (
			<Form>
				<FormGroup disabled={disabled}>
					<Label for='fontFamily'>Font Family</Label>
					<Input type='text' name='font' id='fontFamily' placeholder='Enter font family such as Arial Roboto ...' onChange={(value) => this.setFormValue('fontFamily', value)}/>
					<FormText>Example help text that remains unchanged.</FormText>
				</FormGroup>
				<FormGroup disabled={disabled}>
					<Label for='fontSize'>Font Size</Label>
					<Input type='number' name='font' id='fontSize' placeholder='Font size such as 25 15 ...'  onChange={(value) => this.setFormValue('fontSize', value)}/>
				</FormGroup>
				<FormGroup fieldset>
					<legend>Font Size Unit</legend>
					<FormGroup check disabled={disabled}>
						<Label check>
							<Input type='radio' name='formUnit' onChange={() => this.setFormValue('fontUnit', 'px')} defaultChecked />
							{' px'}
						</Label>
					</FormGroup>
					<FormGroup check disabled={disabled}>
						<Label check>
							<Input type='radio' name='formUnit'  onChange={() => this.setFormValue('fontUnit', 'em')}/>
							{' em'}
						</Label>
					</FormGroup>
				</FormGroup>
				<FormGroup>
					<Label for="asciiRanges" xs={12}>ASCII Range</Label>
					<FormGroup row>
						<Col xs={6}>
							<Input type="number" name="asciiStart" id="asciiStart" placeholder="Character start index" value={asciiStartIndex} disabled/>
						</Col>
						<Col xs={6}>
							<Input type="number" name="asciiEnd" id="asciiEnd" placeholder="Character end index"  value={asciiEndIndex} disabled/>
						</Col>
					</FormGroup>
				</FormGroup>
				<Button disabled={disabled} onClick={() => this.onFormSubmit()}>Start Calculation</Button>
			</Form>
		);
	}

}