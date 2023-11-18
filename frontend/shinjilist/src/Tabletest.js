import './App.css';






function Table(){

    return(
<table className="letable">
  <tr>
    <td><Character link="https://th.bing.com/th/id/OIP.Q415tdOt-BW1lirJbRiU5QAAAA?w=161&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"/></td>
    <td className="tdRight">cell 2</td>
  </tr>
  <tr>
    <td>cell 3</td>
    <td className="tdRight">cell 4</td>
  </tr>
</table>

    );
}

function Character(Link){
  return (
    <>
    Link
 <img src= "https://th.bing.com/th/id/OIP.Q415tdOt-BW1lirJbRiU5QAAAA?w=161&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
      onClick={test}/>
    </>

  );

  function test(){
    console.log("cool")
    alert("bro")
  }
}

export default Table;