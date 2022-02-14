import { Cancel } from '@material-ui/icons'
import './howtouse.css'

export default function HowToUse({setShowHowToUse}) {

    return (
        <div className="container">
            I'm under construction; I'll get this part done later. Don't make a mean grilled cheese sandwich out of it!
            <Cancel className="cancel" onClick={() => setShowHowToUse(false)} />
        </div>
    )
}
