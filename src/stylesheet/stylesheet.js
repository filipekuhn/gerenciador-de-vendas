import { StyleSheet }  from 'react-native';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#5390fe',
    color: '#5390fe',
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 70,
    marginRight: 70,
    borderRadius: 80
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    alignItems: 'center',        
    padding: 15,
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 70,
    marginRight: 70,
    borderRadius: 80
  },
  editRowButton: {
    alignItems: 'center',
    backgroundColor: '#5390fe',
    color: '#5390fe',
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 50,
        
  },
  deleteRowButton: {
    backgroundColor: '#FF0000',
    alignItems: 'center',        
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 50
  },
  text: {
    color: '#FFF',
  },
  icon: {
    color: '#FFF'
  },
  textInput: {    
    borderLeftColor: '#FFF',
    borderRightColor: '#FFF',    
    borderTopColor: '#FFF',
    borderBottomColor: '#5DADE2',
    borderWidth: 1,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  picker: {
    height: 50, 
    width: 150,
    borderLeftColor: '#FFF',
    borderRightColor: '#FFF',    
    borderTopColor: '#FFF',
    borderBottomColor: '#5DADE2',
    borderWidth: 1,
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,    
    position: 'relative',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    paddingBottom: 22
   },
   item: {
     padding: 5,
     fontSize: 20,
     height: 44,
   },
   activity: {
     position: 'absolute',
     left: 0,
     right: 0,
     top: 0,
     bottom: 0,
     alignItems: 'center',
     justifyContent: 'center'
   },
   message: {
     padding: 16,
     fontSize: 18,
     color: '#5390fe'
   },
   multiLines: {
    justifyContent: 'center', 
    flex: 1, 
    borderColor: '#d3d3d3', 
    borderWidth: 1, 
    marginTop: 5 
  },
});

export default styles;