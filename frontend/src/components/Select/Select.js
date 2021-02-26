import React from 'react';
import './Select.css';

class Select extends React.Component {

  constructor() {
    super();

  }

  render() {
    return (
      <select
        className="form-control h4"
        value={this.props.value}
        onChange={this.props.handleChange}>

        {this.props.data.map(x =>
          <option className="h5" key={x[this.props.idKey]} value={x[this.props.idKey]}>{x[this.props.valueKey]}</option>
        )}

      </select>
    );
  }

}

export default Select;
