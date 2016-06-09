/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./SourceNamespaceManager.ts" />
/// <reference path="../Logger.ts" />

/**
 * A SourceItf describes a Source to call inside a service.
 *
 * Each SourceItf must declare a method 'run' which will be executed using the provided params.
 */
class SourceItf {

	/**
	 * The SourceNamespaceManager associated with a source
	 *
	 * @property _sourceNamespaceManager
	 * @type SourceNamespaceManager
	 */
	private _sourceNamespaceManager : SourceNamespaceManager;

	/**
	 * The params used by the source call
	 *
	 * @property _params
	 * @type any
	 */
	private _params : any;

	constructor(params : any, sourceNamespaceManager : SourceNamespaceManager) {
		this.setParams(params);
		this.setSourceNamespaceManager(sourceNamespaceManager);

		//this.run();
	}

	public setParams(params : any) {
		this._params = params;
	}

	public setSourceNamespaceManager(sourceNamespaceManager : SourceNamespaceManager) {
		this._sourceNamespaceManager = sourceNamespaceManager;
	}

	public getParams() : any {
		return this._params;
	}

	public getSourceNamespaceManager() : SourceNamespaceManager {
		return this._sourceNamespaceManager;
	}

	public run() {
		Logger.error("The method run() should be implemented.");
	}

	public checkParams(paramNames : Array<string>) : boolean {
		for (var i = 0; i < paramNames.length; i++) {
			var paramName = paramNames[i];
			if (this._params[paramName] == undefined) {
				Logger.error("ParameterError : the following parameter is undefined : "+paramName);
				return false;
			}
		}
		return true;
	}
}