import React from 'react';
import './Pagination.css';
import styled from "styled-components";
import Spinner from '../Spinner/Spinner';

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
          let pageInterval = null;

          if (currentPage === 2) {
            pageInterval = currentPage - 1;
          } else if (currentPage === 1) {
            pageInterval = currentPage;
          } else if (currentPage === (maxPage - 1) && maxPage > 5) {
            pageInterval = currentPage - 3;
          } else if (currentPage === maxPage && maxPage > 5) {
            pageInterval = currentPage - 4;
          } else {
            pageInterval = currentPage - 2;
          }

          let pageNumbers = maxPage > 0 && maxPage < 5 ? maxPage : 5;
          let arrElem = [];
          for (let i = pageInterval, n = 1 + pageNumbers; i < n; i++) {
            let isActive = (currentPage === i) ? "active" : "";
            arrElem.push(<li
              key={i}
              id={i}
              onClick={this.handleClick(i)}
              className={`page-item ${isActive}`}
            >
              <StyledA className="page-link" key={i}>{i}</StyledA>
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
          <nav aria-label="Pagination" className="mb-2 d-flex justify-content-center">
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
