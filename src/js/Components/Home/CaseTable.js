import React from "react";
import { Table, Popconfirm, message, Input, Button, Icon } from "antd";
import { withRouter } from "react-router-dom";
import Functions from "../../../Functions";
import Highlighter from "react-highlight-words";
import Columns from "react-columns";
import Backend from "../../../serviceBackend";

class CaseTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info_case: {}
    };
  }

  confirmCancel = (archiveType, id) => {
    var values = {};
    values["id"] = id;

    if (archiveType) {
      Backend.sendRequest("GET", `case?id=${id}`)
        .then(response => {
          return response.json();
        })
        .then(data => {
          data.cases[0]["approval_status"] = "Anular";
          return this.setState({ info_case: data.cases[0] });
        })
        .then(_ => {
          Backend.sendRequest("PATCH", "case", {
            items: [this.state.info_case]
          }).then(response => {
            if (response.status === 200) {
              message.success("Solicitud anulada exitosamente.");
            } else if (response.status === 401) {
              message.error("Usuario sin autorización.");
            } else {
              message.error("Ha ocurrido un error anulando el caso.");
              console.error(
                "Login Error: Backend HTTP code " + response.status
              );
            }
          });
        });
    } else {
      Backend.sendRequest("GET", `case?id=${id}`)
        .then(response => {
          return response.json();
        })
        .then(data => {
          data.cases[0]["approval_status"] = "Desistir";
          return this.setState({ info_case: data.cases[0] });
        })
        .then(_ => {
          Backend.sendRequest("PATCH", "case", {
            items: [this.state.info_case]
          }).then(response => {
            if (response.status === 200) {
              message.success("Solicitud desistida exitosamente.");
            } else if (response.status === 401) {
              message.error("Usuario sin autorización.");
            } else {
              message.error("Ha ocurrido un error desistiendo el caso.");
              console.error(
                "Login Error: Backend HTTP code " + response.status
              );
            }
          });
        });
    }
  };

  state = {
    searchText: "",
    searchedColumn: ""
  };

  getColumnSearchProps = (dataIndex, searchTerm) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Buscar por ${searchTerm}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Limpiar
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : "#000000" }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    var columns = [
      {
        title: "Tipo de solicitud",
        dataIndex: "_cls_display",
        key: "_cls_display",
        width: "20%",
        sorter: (a, b) => a._cls_display.localeCompare(b._cls_display),
        ...this.getColumnSearchProps("_cls_display", "tipo de solicitud")
      },
      {
        title: "DNI",
        dataIndex: "student_dni",
        key: "student_dni",
        //sorter: (a, b) => a.student_dni.localeCompare(b.student_dni),
        ...this.getColumnSearchProps("student_dni", "DNI")
      },
      {
        title: "Nombres",
        dataIndex: "student_name",
        key: "student_name",
        sorter: (a, b) => a.student_name.localeCompare(b.student_name),
        ...this.getColumnSearchProps("student_name", "nombres")
      },
      {
        title: "Plan de estudios",
        dataIndex: "academic_program",
        key: "academic_program",
        sorter: (a, b) => a.academic_program.localeCompare(b.academic_program),
        ...this.getColumnSearchProps("academic_program", "programa")
      },
      /*{
        title: "Creación",
        dataIndex: "date_stamp",
        key: "date_stamp",
        width: "10%",
        sorter: (a, b) => a.date_stamp.localeCompare(b.date_stamp),
        ...this.getColumnSearchProps("date_stamp")
      },*/
      /*{
        title: "Radicación",
        dataIndex: "date",
        key: "date",
        width: "10%",
        sorter: (a, b) => a.date.localeCompare(b.date),
        ...this.getColumnSearchProps("date")
      },*/
      {
        title: "Acta #",
        dataIndex: "consecutive_minute",
        key: "consecutive_minute",
        width: "10%",
        //sorter: (a, b) => a.consecutive_minute.localeCompare(b.consecutive_minute),
        ...this.getColumnSearchProps("consecutive_minute", "acta")
      },
      {
        title: "Año",
        dataIndex: "year",
        key: "year",
        //sorter: (a, b) => a.year.localeCompare(b.year),
        ...this.getColumnSearchProps("year", "año")
      },
      {
        title: "Periodo",
        dataIndex: "academic_period",
        key: "academic_period",
        //sorter: (a, b) => a.academic_period.localeCompare(b.academic_period),
        ...this.getColumnSearchProps("academic_period", "periodo")
      },
      /*{
        title: "Rta CF",
        dataIndex: "approval_status",
        key: "approval_status",
        width: "8%",
        sorter: (a, b) => a.approval_status.localeCompare(b.approval_status),
        ...this.getColumnSearchProps("approval_status")
      },
      {
        title: "Rta CA",
        dataIndex: "advisor_response",
        key: "advisor_response",
        width: "8%",
        ...this.getColumnSearchProps("advisor_response")
      },*/
      {
        title: "Editar",
        key: "edit",
        render: (text, record) => (
          <span>
            {/* eslint-disable-next-line */}
            <a
              onClick={() =>
                this.props.history.push({
                  pathname: "/edit/" + record.id,
                  state: { _cls: record._cls }
                })
              }
            >
              Editar
            </a>
            <br />
            <Popconfirm
              title="¿Qué acción desea tomar con la solicitud?"
              onConfirm={() => this.confirmCancel(true, record.id)}
              onCancel={() => this.confirmCancel(false, record.id)}
              okText="Anular"
              cancelText="Desistir"
              placement="left"
            >
              {/* eslint-disable-next-line */}
              <a>Archivar</a>
            </Popconfirm>
            <br />
            <Popconfirm
              title="¿Qué tipo de vista previa desea generar?"
              onConfirm={() => Functions.generateCouncil(false, record.id)}
              onCancel={() => Functions.generateCouncil(true, record.id)}
              okText="Consejo"
              cancelText="Comité"
              placement="left"
            >
              {/* eslint-disable-next-line */}
              <a>Vista Previa</a>
            </Popconfirm>
          </span>
        )
      }
    ];
    return (
      <Table
        dataSource={this.props.dataSource}
        columns={columns}
        bordered={true}
        expandedRowRender={record => (
          <Columns gap={"0px"} columns={3}>
            <div>
              <b>Fecha de radicación:</b> {record.date}.
            </div>
            <div>
              <b>Respuesta de Consejo de Facultad:</b> {record.approval_status}.
            </div>
            <div>
              <b>Respuesta de Comité Asesor:</b> {record.advisor_response}.
            </div>
          </Columns>
        )}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          locale: { items_per_page: "por página" },
          pageSizeOptions: ["10", "20", "50", "100"],
          position: "bottom",
          size: "small",
          showTotal: showTotal
        }}
      />
    );
  }
}

function showTotal(total) {
  return `Hay ${total} solicitudes`;
}

export default withRouter(CaseTable);
