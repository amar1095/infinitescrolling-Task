import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const App = () => {
  const [gridApi, setGridApi] = useState(null);

  const columns = [
    { headerName: "id", field: "id", filter: "agTextColumnFilter",cellRenderer:'loading' },
    { headerName: "isActive", field: "isActive", filter: "agTextColumnFilter" },
    { headerName: "age", field: "age", filter: "agTextColumnFilter" },
    { headerName: "name", field: "name", filter: "agTextColumnFilter" },
    { headerName: "gender", field: 'gender', filter: "agTextColumnFilter" },
    { headerName: "company", field: 'company', filter: "agTextColumnFilter" },
    { headerName: "email", field: 'email', filter: "agTextColumnFilter" },
    { headerName: "phone", field: 'phone', filter: "agTextColumnFilter" },
    { headerName: "address", field: 'address', filter: "agTextColumnFilter" },
  ]
  const datasource = {
    getRows(params) {
      console.log(JSON.stringify(params, null, 1));
      const { startRow, endRow, filterModel, sortModel } = params
      let url = `http://localhost:4000/clients?`
      //Sorting
     if (sortModel.length) {
        const { colId, sort } = sortModel[0]
        url += `_sort=${colId}&_order=${sort}&`
      }
      //Filtering
      const filterKeys = Object.keys(filterModel)
      filterKeys.forEach(filter => {
        url += `${filter}=${filterModel[filter].filter}&`
      })
    
      url += `_start=${startRow}&_end=${endRow}`
      fetch(url)
        .then(httpResponse => httpResponse.json())
        .then(response => {
          params.successCallback(response, response.lastrow);
        })
        .catch(error => {
          console.error(error);
          params.failCallback();
        })
    }
  };
  
  const onGridReady = (params) => {
    setGridApi(params);
    // register datasource with the grid
    params.api.setDatasource(datasource);
  }
const components={
  loading:(params)=>{
    if(params.value!==undefined){
      return params.value
    }else{
      return "Loading ......."
    }
  }
}
  return (
    <div>
      <h1 align="center">Demo project</h1>
      <h4 align='center'>Implement Infinite Scroll in ag Grid</h4>
      <div className="ag-theme-alpine" style={{height:400}}>
        <AgGridReact
          columnDefs={columns}
        // pagination={true}
        // domLayout="autoHeight"
          rowModelType="infinite"
          onGridReady={onGridReady}
          components={components}
          defaultColDef={{ filter: true, floatingFilter: true, sortable: true }}

          
        />
      </div>
    </div>
  );
};
export default App