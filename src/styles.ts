
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
    },
    input: {
      width: '75%',
      height: 40,
      marginBottom: 12,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 8,
      backgroundColor:'white',
      borderStyle: 'solid',
      borderRadius:10,
      borderEndColor:'black',
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
      padding:10,
      borderRadius:8 , 
      
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
      fontSize:50,
      bottom:120,
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
      
      
    },
    inputform:{
      width:'100%',
      borderBottomRightRadius:0,
      borderBottomLeftRadius:0,
      borderTopWidth:0,
      borderRightWidth:0,
      borderLeftWidth:0,
    },
    formlabel:{
      bottom:10,
      fontSize:20,
      paddingHorizontal:10,
    }
  });

export default styles;