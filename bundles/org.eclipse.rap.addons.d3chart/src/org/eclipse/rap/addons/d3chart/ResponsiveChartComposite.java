package org.eclipse.rap.addons.d3chart;

import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.FillLayout;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Listener;

public class ResponsiveChartComposite extends Composite {

	private static final long serialVersionUID = -7086587485307062063L;
	private ResponsiveChart responsiveChart;
	private GridData gridData;
	Listener resizeListener = new Listener() {
		private static final long serialVersionUID = -3663959798846561526L;

		@Override
		public void handleEvent(org.eclipse.swt.widgets.Event event) {
	        updateLayout();
		}
	};
	
	/**
	 * Constructor. Returns a new ResponsiveChartComposite. 
	 * Sets FillLayout to be this composite's layout. 
	 * Adds a Listener that redraws this Chart when resizing. 
	 * @param parent
	 * @param style
	 */
	public ResponsiveChartComposite(Composite parent, int style) {
		super(parent, style);
		setLayout(new FillLayout());
		this.addListener(SWT.Resize, resizeListener);
		gridData = new GridData(SWT.FILL, SWT.FILL, true, true, 1, 1);
		this.setLayoutData( getGridData() );
	}
	
	/**
	 * Constructor. Returns a new ResponsiveChartComposite. 
     * Sets FillLayout to be this composite's layout. 
     * Adds a Listener that redraws this Chart when resizing. 
	 * @param parent
	 * @param style
	 * @param heightHint the element's maximum height
	 */
	public ResponsiveChartComposite(Composite parent, int style, int heightHint) {
	  super(parent, style);
      setLayout(new FillLayout());
      this.addListener(SWT.Resize, resizeListener);
      gridData = new GridData(SWT.FILL, SWT.FILL, true, false, 1, 1);
      gridData.heightHint = heightHint;
      this.setLayoutData( gridData );
	}

	public ResponsiveChart getResponsiveChart() {
		return responsiveChart;
	}

	/** 
	 * Is called by the constructor of ResponsiveChart so that this 
	 * composite knows its chart and can replace it by a new
	 * chart when resizing. 
	 * @param responsiveChart
	 */
	public void setResponsiveChart(ResponsiveChart responsiveChart) {
		this.responsiveChart = responsiveChart;
	}

	/**
	 * This method copies the values of the old chart to a new
	 * chart, disposes the old chart and displays the new chart. 
	 * The size of the new chart is adapted to the new composite's size. 
	 */
	private void updateLayout() {
		ResponsiveChart oldChart = responsiveChart;
		responsiveChart = oldChart.getNewInstance();
		oldChart.dispose();
		layout();
	}

	public GridData getGridData() {
      return gridData;
    }
    
	/**
	 * Custom GridData can be set. 
	 * @param gridData
	 */
    public void setGridData( GridData gridData ) {
      this.gridData = gridData;
    }	
}
