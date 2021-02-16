import React from 'react'

export class Spinner extends React.Component {
  render() {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
}

export default Spinner
