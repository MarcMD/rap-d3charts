package org.eclipse.rap.addons.d3chart;

public abstract class ResponsiveChart extends Chart {

	private static final long serialVersionUID = -4246502312151637008L;

	public ResponsiveChart(ResponsiveChartComposite parent, int style, String remoteType) {
		super(parent, style, remoteType);
		parent.setResponsiveChart(this);
	}
	
	/**
	 * Copies values of another instance to this instance. 
	 * Can be called by a Listener when resizing the Composite 
	 * (i.e. when the chart needs to be redrawn). 
	 * @param responsiveChart is the other instance with the values to be copied
	 * and needs to be of the same type as this current implementation 
	 */
	public abstract void copyValuesOfAnotherInstance(ResponsiveChart responsiveChart);
	
	/**
	 * Creates and returns another instance of this type with the same values. 
	 * Can be called by a Listener when resizing the Composite 
	 * (i.e. when the chart needs to be redrawn).
	 * @return the new Instance of the same type 
	 */
	public abstract ResponsiveChart getNewInstance();

}
