
import { StyleSheet } from 'react-native';



  const styles = StyleSheet.create({
    fundocard:{
      resizeMode: 'contain',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height:150,
    },
    fundo:{
      resizeMode: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems:'center',
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap:5,
    },
    input: {
      width: '75%',
      height: 60,
      marginBottom: 12,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 8,
      backgroundColor:'white',
      borderStyle: 'solid',
      borderRadius:10,
      borderEndColor:'black',
      position:'relative',
    },
    inputsenha:{
     width:"85%",
      height: 58,
      marginBottom: 12,
      borderColor: 'gray',
      borderWidth: 0,
      paddingHorizontal: 8,
      backgroundColor:'white',
      borderStyle: 'solid',
      borderRadius:10,
      borderEndColor:'black',
      position:'relative',
      top:6,
    },
    senhadiv:{
      width:"75%",
      height:60,
      marginBottom: 12,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:"#FFF",
      borderEndColor:'black',
      borderStyle: 'solid',
      borderRadius:10,
      borderWidth:1,
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    button: {
      backgroundColor:'#7CFC00',
      width:'50%',
      textAlign:'center',
      alignItems:'center',
      borderRadius:8 , 
      justifyContent:'center',
      height:50,
    },
    buttondiv: {
      width:'50%',
      alignItems:'center',
      textAlign:'center',
      display:'flex',
      gap:5,
      flexDirection:'row',
    },
    title:{
      top:20,
      fontSize:25,
      marginBottom:50,
    },
    listbox:{
      marginBottom:50,
      width:"75%",
      justifyContent:'center',
      alignSelf:'center'
    },
    home:{
      display:'flex',
      flex:1,
      alignItems:'center',
      gap:50,
  
    },
    card:{
      width:'80%',
      height:300,
      alignItems:'center',
      borderStyle:'solid',
      borderWidth:5,
      borderRadius:20,
      borderTopRightRadius:25,
      borderColor:'#D3D3D3',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.9,
      shadowRadius: 4,
      elevation: 0,
      gap:10,
      justifyContent:'flex-end',
      bottom:10
      
    },
    buttons:{
      bottom:20,
      height:50,
      width:'100%',
      left:'50%',
    
      alignSelf: 'center'
    },
    buttoncria:{
      width:"90%",
      bottom:10,
    },
    buttoninfo: {
      backgroundColor:'#7CFC00',
      width:'100%',
      textAlign:'center',
      alignItems:'center',
      padding:10,
      borderRadius:8 , 
      
    },
    cadastro:{
      paddingHorizontal:50,
      display:'flex',
      flex:1,
      justifyContent:'center',
      gap:3,
      
    },
    calendario:{
      display:'flex',
      flexDirection:'row',
      flexWrap:'wrap',
      gap:10,
      top:'6%',
      left:'3.5%',
      paddingVertical:'5%',
      
    },
    itemcalendario:{
      display:"flex",
      backgroundColor:'lightgray',
      opacity:0.7,
      borderRadius: 8,
      justifyContent:'center',
      alignItems:'center',
      paddingTop:10,
      width:150,
      padding:10,
      
    },
    doubleitem:{
      display:'flex',
      flexDirection:'row',
      flexWrap:'nowrap'
    },
    inputform:{
      width:'100%',
      borderBottomRightRadius:0,
      borderBottomLeftRadius:0,
      borderTopWidth:0,
      borderRightWidth:0,
      borderLeftWidth:0,
    },
    inputsenhacadastro:{
      borderBottomRightRadius:0,
      borderBottomLeftRadius:0,
      borderTopWidth:0,
      borderRightWidth:0,
      borderLeftWidth:0,
      marginBottom: 12,
    },
    formlabel:{
      bottom:50,
      fontSize:25,
      paddingHorizontal:10,
      textAlign:'center',
    },
    titlecadastro:{
      bottom:0,
      marginBottom:50,
      top:30
    },
    celular:{
      marginBottom:0,
    }

  });

export default styles;