import React from "react";
import { withRouter } from "react-router-dom";
import { Form, Row, Divider, Typography } from "antd";
import MutableComponent from "./MutableComponent";
import auth from "../../../auth";
import BackEndUrl from "../../../backendurl";
import Columns from "react-columns";

const { Title } = Typography;

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      full_name: "",
      decision_maker: "",
      fields: [],
      cls: this.props.history.location.state._cls
    };
  }
  createInputs = () => {
    return this.state.fields.map(this.createInput);
  };
  createInput = i => {
    return <MutableComponent fieldName={i[0]} metadata={i[1]} />;
  };
  render() {
    return (
      <div>
        <Divider style={{ background: "#ffffff00" }} />
        <Row>
          <Title>Edición de solicitud</Title>
        </Row>
        <Row>
          <Form>
            <Columns columns="2">{this.createInputs()}</Columns>
          </Form>
        </Row>
        <Divider />
      </div>
    );
  }
  componentDidMount() {
    fetch(BackEndUrl + "infocase?cls=" + this.state.cls.split(".")[1], {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Token " + auth.getToken()
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ full_name: data.full_name });
        this.setState({ decision_maker: data.decision_maker });
        delete data.full_name;
        delete data.decision_maker;
        this.setState({ fields: Object.entries(data) });
      });
  }
}

export default withRouter(Edit);
