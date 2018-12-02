import React from 'react';
import PropTypes from 'prop-types';

export default class FontConstantCalculator extends React.Component {

	static propTypes = {
		characterCode: PropTypes.number.isRequired,
		fontSize: PropTypes.string.isRequired,
		fontUnit: PropTypes.string.isRequired,
		fontFamily: PropTypes.string.isRequired,
		onCalculationCompleted: PropTypes.func
	}

	constructor(props) {
		super(props);
		this.state = {
			boxWidthMultiplier: 4,
			boxWidth: 0,
			prevBoxHeight: 0,
			finalWidth: null,
			finalCharCount: null,
			calculatedFontConstant: null
		}
		this.containerRef = React.createRef();
		this.calculationForwardInterval = null;
		this.calculationBackwardInterval = null;
	}

	componentDidMount() {
		const {fontSize, characterCode, fontUnit} = this.props;
		this.prepareCalculation(fontSize, this.checkExceptionalChars(characterCode), fontUnit);
	}

	componentWillUpdate(nextProps) {
		const {characterCode, fontSize, fontFamily} = this.props;
		if(nextProps.characterCode !== characterCode || nextProps.fontSize !== fontSize || nextProps.fontFamily !== fontFamily ) {
			this.prepareCalculation(nextProps.fontSize, this.checkExceptionalChars(nextProps.characterCode), nextProps.fontUnit);		
		}
	}

	checkExceptionalChars(characterCode) {
		// Replace breakable space with un-breakable
		if(characterCode === 32) {
			return 160;
		}
		return characterCode;
	}

	prepareCalculation(fontSize, characterCode, fontUnit) {
		const {boxWidthMultiplier} = this.state;
		if(fontSize && !isNaN(parseFloat(fontSize))) {
			const fontSizeDecimal = fontUnit==='rem' ? parseFloat(fontSize) * 16 : parseFloat(fontSize);
			const boxWidth = boxWidthMultiplier * fontSizeDecimal;
			if(this.state.boxWidth !== boxWidth) {
				this.setState({boxWidth}, () => this.createCalculationSpan(fontSizeDecimal, characterCode, 'px'));
			}
		}
	}

	createCalculationSpan(fontSizeDecimal, characterCode, fontUnit) {
		const {boxWidth} = this.state;

		if(this.containerRef && this.containerRef.current) {
			const containerNode = this.containerRef.current;
			// Clear prev.
			if(containerNode.childNodes.length > 1) {
				containerNode.removeChild(containerNode.childNodes[1]);
			}
			const div = document.createElement('div');
			containerNode.appendChild(div);
			div.style.width = boxWidth + fontUnit;
			div.style.position = 'absolute';
			div.style.opacity = '0';
			div.innerHTML = `&#${characterCode}`;
			this.calculationForwardInterval = setInterval(() => {
				const {prevBoxHeight} = this.state;
				const currentHeight = div.getBoundingClientRect() ? div.getBoundingClientRect().height : null;
				if(!prevBoxHeight && currentHeight) {
					this.setState({prevBoxHeight: currentHeight});
				}
				if(prevBoxHeight && currentHeight && prevBoxHeight !== currentHeight) {
					this.calculationBackwardInterval = setInterval(() => {
						const {prevBoxHeight} = this.state;
						const currentHeight = div.getBoundingClientRect() ? div.getBoundingClientRect().height : null;
						if(prevBoxHeight !== currentHeight) {
							div.style.width = (parseFloat(div.style.width.replace(/^\d\./g, '')) + 1) + fontUnit;
						} else {
							const charLength = (new RegExp(/(&[^&;]+;)/g).test(div.innerHTML)) ? div.innerHTML.match(new RegExp(/(&[^&;]+;)/g)).length  : div.innerHTML.length;
							const calculatedFontConstant = fontSizeDecimal / (parseFloat(div.style.width.replace(/^\d\./g, '')) / charLength);
							this.setState({finalWidth: div.style.width, finalCharCount: charLength, calculatedFontConstant} );
							containerNode.removeChild(div);
							if(this.props.onCalculationCompleted && typeof this.props.onCalculationCompleted === 'function') {
								this.props.onCalculationCompleted(this.props.characterCode, calculatedFontConstant);
							}
							clearInterval(this.calculationBackwardInterval);
						}
					}, 500)
					clearInterval(this.calculationForwardInterval);
				} else {
					div.innerHTML += `&#${characterCode}`;
				}
			}, 500);
		}
	}

	render() {
		const {fontFamily, fontSize, fontUnit, characterCode } = this.props;
		const {calculatedFontConstant} = this.state;
		const fontStyles = {fontFamily, fontSize: (fontSize + fontUnit), wordBreak: 'break-word', wordWrap: 'break-word', overflowWrap: 'break-word', textAlign: 'center'};
		return (
			<div style={fontStyles} >
				<div ref={this.containerRef} style={{fontSize: '1.5rem'}}>
					{`Character:'${String.fromCharCode(characterCode)}'`}
				</div>
				{calculatedFontConstant ? 
				(<div style={{fontSize: '1.5rem'}}>
					{`Font Constant:${calculatedFontConstant.toFixed(3)}`}
				</div>)
				: (
					<div class="spinner">
						<div class="double-bounce1"></div>
						<div class="double-bounce2"></div>
					</div>
				)}
			</div>
		);
	}

}