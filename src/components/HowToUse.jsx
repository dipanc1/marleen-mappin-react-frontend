import { Cancel } from '@material-ui/icons'
import './howtouse.css'

export default function HowToUse({ setShowHowToUse }) {

    return (
        <div className="container">
            <p>Made With
                &#10084; by
                <a style={{ textDecoration: 'none', marginLeft: 4, marginRight: 4 }} href="https://linkedin.com/in/dipan-chhabra-454520164" target={'_blank'} rel='noreferrer'>
                    Dipan
                </a>
                for Marleen </p>
            <p>&#128020;  {' Chicken Farm © ' + new Date().getFullYear()}</p>
            <Cancel className="cancel" onClick={() => setShowHowToUse(false)} />
        </div>
    )
}
