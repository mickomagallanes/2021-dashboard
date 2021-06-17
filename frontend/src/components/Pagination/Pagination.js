import React from 'react';
import './Pagination.css';
import styled from "styled-components";
import Spinner from '../Spinner/Spinner';

function getPagingRange(current, { min = 1, total = 20, length = 5 } = {}) {
  if (length > total) length = total;

  let start = current - Math.floor(length / 2);
  start = Math.max(start, min);
  start = Math.min(start, min + total - length);

  return Array.from({ length: length }, (el, i) => start + i);
}

class Pagination extends React.Component {

  // pass the page number to the event listener
  handleClick = (pageNumber) => {
    return () =>
      this.props.onClick(pageNumber);
  }

  render() {
    const { currentPage, maxPage } = this.props;

    const pageConditionals = [
      {
        cond: () => {
          return currentPage !== 1 &&
            <li
              key="first"
              id="first"
              onClick={this.handleClick(1)}
              className="page-item"
            >
              <StyledA className="page-link">
                <span aria-hidden="true">«</span>
                <span className="sr-only">First</span>
              </StyledA>

            </li>
        }
      },
      {
        cond: () => {
          return currentPage !== 1 &&
            <li
              key="prev"
              id="prev"
              onClick={this.handleClick(currentPage - 1)}
              className="page-item"
            >
              <StyledA className="page-link">
                <span aria-hidden="true">‹</span>
                <span className="sr-only">Previous</span>
              </StyledA>

            </li>
        }
      },
      {
        // numbering of pagination
        cond: () => {
          let pageArr = getPagingRange(currentPage, { min: 1, total: maxPage, length: 5 })

          let arrElem = [];

          for (let i = 0, n = pageArr.length; i < n; i++) {
            let currNumber = pageArr[i];

            let isActive = (currentPage === currNumber) ? "active" : "";
            arrElem.push(<li
              key={`page${currNumber}`}
              id={`page${currNumber}`}
              onClick={this.handleClick(currNumber)}
              className={`page-item ${isActive}`}
            >
              <StyledA className="page-link" key={currNumber}>{currNumber}</StyledA>
            </li>)
          }

          return arrElem;

        }
      },
      {
        cond: () => {
          return currentPage !== maxPage &&
            <li
              key="next"
              id="next"
              onClick={this.handleClick(currentPage + 1)}
              className="page-item"
            >
              <StyledA className="page-link">
                <span aria-hidden="true">›</span>
                <span className="sr-only">Next</span>
              </StyledA>

            </li>
        }
      },
      {
        cond: () => {
          return currentPage !== maxPage &&
            <li
              key="last"
              id="last"
              onClick={this.handleClick(maxPage)}
              className="page-item"
            >
              <StyledA className="page-link">
                <span aria-hidden="true">»</span>
                <span className="sr-only">Last</span>
              </StyledA>

            </li>
        }
      },
    ];

    return (
      <>
        {!maxPage && <Spinner />}
        {!!maxPage &&
          <nav data-testid="Pagination" aria-label="Pagination" className="mb-2 d-flex justify-content-center">
            <ul id="page-numbers" className="pagination flex-wrap">
              {pageConditionals.map(obj => obj.cond())}
            </ul>
          </nav>
        }
      </>
    );

  }
}

const StyledA = styled.a`
    color: #ffffff;
    cursor: pointer;
    &:hover: {
      color: #0056b3;
    }
`

export default Pagination;
