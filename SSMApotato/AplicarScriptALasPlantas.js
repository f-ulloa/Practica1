function AplicarScriptALasPlantas() {
  //Acceder a un libro por link, en donde esta el listado de plantas con su URL
  let libroCOPIAx2=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1VAlrmViS9S5n5y6mCE8bhI8tkK03kxa0At_c7x1jkuc/edit#gid=850185646')

  //Formar par Nombre planta-URL copia de plantas
  let sheet=libroCOPIAx2.getSheetByName('Listado Plantas')
  let columnaURLcopias=sheet.getRange('D2:D29').getValues();
  let columNombresPlanta=sheet.getRange('A2:A29').getValues();

  for (let i=0; i<columNombresPlanta.length;i++){
    if(columnaURLcopias[i]!=''){
      let parNombreURL={NombrePlanta: columNombresPlanta[i], URLcopia: columnaURLcopias[i]}
      console.log('Ejecuando el Script de rangos dinamicos en : ',columNombresPlanta[i] );
      ArangoDinamicosSSMA(parNombreURL);
      console.log('Ejecuando el Script de agregar Indicadores: ',columNombresPlanta[i] );
      AgregarIndicadores(parNombreURL);
    }
  }
}
