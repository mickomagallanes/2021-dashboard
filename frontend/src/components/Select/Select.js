import React from 'react';
import './Select.css';

class Select extends React.Component {

  constructor() {
    super();

  }

  render() {
    // TODO: make a default blank OPTION
    return (
      <select
        id={this.props.id}
        className="form-control"
        value={this.props.value}
        onChange={this.props.onChange}>

        {this.props.data.map(x =>
          <option key={x[this.props.idKey]} value={x[this.props.idKey]}>{x[this.props.valueKey]}</option>
        )}

      </select>
    );
  }

}

export default Select;
