import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    this.setState({
      hasError: error,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
        <br/><br/>
        <h1 style={{ fontWeight: "100", fontSize: "50px" }}>
          Something went wrong...
        </h1>
        </>
      );
    }
    return this.props.children;
  }
}
