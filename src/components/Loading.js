import ReactLoading from 'react-loading';


function Loading() { 
    return(
        <div className="Loading">
            <ReactLoading type="spin" color="#3357FF" width={200} height={200}/><br/>
        </div>
    )
}

export default Loading;