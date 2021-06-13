import React from 'react';
import './Select.css';

/**
  * creates a table
  * @param {String} id id value of the select element
  * @param {Boolean} value current selected value
  * @param {Array} data array data to be processed for options
  * @param {Array} className classn css of the table
  * @param {Array} idKey key value of the option value from data
  * @param {Array} valueKey key value for the option label from data
  * @param {Array} onChange event listener of select
  * @param {String} disabled is select disabled
  */
class Select extends React.Component {

  render() {

    return (
      <select
        id={this.props.id}
        className={this.props.className}
        value={this.props.value}
        onChange={this.props.onChange}
        disabled={this.props.disabled}
      >

        {this.props.data.map(x =>
          <option key={x[this.props.idKey]} value={x[this.props.idKey]}>{x[this.props.valueKey]}</option>
        )}

      </select>
    );
  }

}

export default Select;
