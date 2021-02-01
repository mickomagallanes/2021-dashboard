import React from 'react'

export class Spinner extends React.Component {
  render() {
    return (
      <div>
        <div className="spinner-wrapper">
          <div className="donut"></div>
        </div>
      </div>
    )
  }
}

export default Spinner
