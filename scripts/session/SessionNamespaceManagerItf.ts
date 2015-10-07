/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/**
 * Interface to define a NamespaceManager using Session
 *
 * @interface SessionNamespaceManagerItf
 */
interface SessionNamespaceManagerItf {


	/**
	 * Lock the control of the Screen for the Session in param.
	 *
	 * @method lockControl
	 * @param {Session} session - Session which takes the control of the Screen.
	 */
	lockControl(session : Session);
}