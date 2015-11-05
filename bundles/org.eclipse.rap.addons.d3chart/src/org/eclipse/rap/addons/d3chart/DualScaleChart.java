package org.eclipse.rap.addons.d3chart;

import org.eclipse.rap.json.JsonArray;
import org.eclipse.rap.json.JsonObject;


public class DualScaleChart extends ResponsiveChart {

  private static final long serialVersionUID = 450849897470821262L;
  private static final String REMOTE_TYPE = "d3chart.DualScaleChart";
  private String numeratorName;
  private String denominatorName;
  private JsonArray values;
  private String colorTotal;
  private String colorPercentage;
  private String descriptionTotal;
  private String descriptionPercentage;
  private String fontAttribute;
  private int yAxisLabelWidth;
  private int paddingRight;
  private int percentageDigitsAfterDecimalPoint;
  private int tooltipBoxWidth;
  private int tooltipBoxHeight;
  private int tooltipPadding;
  private boolean displayGridLines;
  private float thresholdValue;

  public DualScaleChart( ResponsiveChartComposite parent, int style ) {
    super( parent, style, REMOTE_TYPE );
    values = new JsonArray();
  }

  public JsonArray getValues() {
    return values;
  }

  /**
   * Instead of this method, the method setNumeratorAndDenominatorNames combined with the method
   * addValue and followed by the method displayNewValues can be used. <br>
   * Sets the values for the Chart. The values are supposed to be organized within a JsonArray. The
   * first element is supposed to be called "name", the name of the second element is the
   * denominator's name, the name of the third element is the name of the numerator. Example: <br>
   * <br>
   * JsonObject yes = new JsonObject(); <br>
   * yes.add("name", "Yes votes"); <br>
   * yes.add("numerator", 11569); <br>
   * yes.add("denominator", 21546); <br>
   * <br>
   * JsonObject no = new JsonObject(); <br>
   * no.add("name", "No votes"); <br>
   * no.add("numerator", 9977); <br>
   * no.add("denominator", 21546); <br>
   * <br>
   * JsonArray values = new JsonArray(); <br>
   * values.add(yes); <br>
   * values.add(no); <br>
   * 
   * @param values
   */
  public void setValues( JsonArray values ) {
    checkWidget();
    this.values = values;
    if( values != null ) {
      remoteObject.set( "values", values );
    }
  }

  public String getDescriptionPercentage() {
    return descriptionPercentage;
  }

  /**
   * Set the description (percentage) for the vertical axis.
   * 
   * @param descriptionPercentage
   */
  public void setDescriptionPercentage( String descriptionPercentage ) {
    checkWidget();
    this.descriptionPercentage = descriptionPercentage;
    if( descriptionPercentage != null ) {
      remoteObject.set( "descriptionPercentage", descriptionPercentage );
    }
  }
  
  public String getDescriptionTotal() {
    return descriptionTotal;
  }
  
  /**
   * Set the description (total) for the vertical axis.
   * 
   * @param descriptionPercentage
   */
  public void setDescriptionTotal(String descriptionTotal) {
    checkWidget();
    this.descriptionTotal = descriptionTotal;
    if(descriptionTotal != null ) {
      remoteObject.set( "descriptionTotal", descriptionTotal );
    }
  }

  public String getColorTotal() {
    return colorTotal;
  }

  /**
   * Set a color (as a String) that describes the color of the bars (total). The color can be named or
   * defined using its name or its (HEX) color value, e.g. "lightblue" or "#141b4d"
   * 
   * @param colorTotal
   */
  public void setColorTotal( String colorTotal ) {
    checkWidget();
    this.colorTotal = colorTotal;
    if( colorTotal != null ) {
      remoteObject.set( "colorTotal", colorTotal );
    }   
  }

  public String getColorPercentage() {
    return colorPercentage;
  }
  
  public void setColorPercentage(String colorPercentage) {
    checkWidget();
    this.colorPercentage = colorPercentage;
    if( colorPercentage != null) {
      remoteObject.set("colorPercentage", colorPercentage);
    }
  }

  public String getFontAttribute() {
    return fontAttribute;
  }

  /**
   * Optional. Set the font style. Default is "12px sans-serif".
   * 
   * @param fontAttribute
   */
  public void setFontAttribute( String fontAttribute ) {
    checkWidget();
    this.fontAttribute = fontAttribute;
    if( fontAttribute != null ) {
      remoteObject.set( "font", fontAttribute );
    }
  }

  public int getYAxisLabelWidth() {
    return yAxisLabelWidth;
  }

  /**
   * Optional. Set the Width of the Y-axis label in order to adapt to the font size.
   * 
   * @param yAxisLabelWidth
   */
  public void setYAxisLabelWidth( int yAxisLabelWidth ) {
    checkSubclass();
    this.yAxisLabelWidth = yAxisLabelWidth;
    if( yAxisLabelWidth != 0 ) {
      this.remoteObject.set( "yAxisLabelWidth", yAxisLabelWidth );
    }
  }

  public int getPaddingRight() {
    return paddingRight;
  }

  /**
   * Optional. Set the padding to the right of the chart. Default is 20.
   * 
   * @param paddingRight
   */
  public void setPaddingRight( int paddingRight ) {
    this.paddingRight = paddingRight;
    if( paddingRight != 0 ) {
      this.remoteObject.set( "paddingRight", paddingRight );
    }
  }

  /**
   * @return the percentageDigitsAfterDecimalPoint
   */
  public int getPercentageDigitsAfterDecimalPoint() {
    return percentageDigitsAfterDecimalPoint;
  }

  /**
   * @param percentageDigitsAfterDecimalPoint the percentageDigitsAfterDecimalPoint to set
   */
  public void setPercentageDigitsAfterDecimalPoint( int percentageDigitsAfterDecimalPoint ) {
    checkWidget();
    this.percentageDigitsAfterDecimalPoint = percentageDigitsAfterDecimalPoint;
    if( percentageDigitsAfterDecimalPoint != 0 ) {
      remoteObject.set( "percentageDigitsAfterDecimalPoint", percentageDigitsAfterDecimalPoint );
    }
  }

  /**
   * Optional. Sets a width for the tooltip box (in px). Should be used to adjust to a new text
   * size. Default is 75.
   * 
   * @param tooltipBoxWidth
   */
  public void setTooltipBoxWidth( int tooltipBoxWidth ) {
    checkWidget();
    this.tooltipBoxWidth = tooltipBoxWidth;
    if( tooltipBoxWidth != 0 ) {
      remoteObject.set( "tooltipBoxWidth", tooltipBoxWidth );
    }
  }

  public int getTooltipBoxWidth() {
    return tooltipBoxWidth;
  }

  /**
   * Optional. Sets a height for the tooltip box (in px). Should be used to adjust to a new text
   * size. Default is 50.
   * 
   * @param tooltipBoxHeight
   */
  public void setTooltipBoxHeight( int tooltipBoxHeight ) {
    checkWidget();
    this.tooltipBoxHeight = tooltipBoxHeight;
    if( tooltipBoxHeight != 0 ) {
      remoteObject.set( "tooltipBoxHeight", tooltipBoxHeight );
    }
  }

  public int getTooltipBoxHeight() {
    return tooltipBoxHeight;
  }

  /**
   * Optional. Sets a padding for the tooltip (in px). The padding describes the space between the
   * tooltip box and the bar. Default is 15.
   * 
   * @param tooltipPadding
   */
  public void setTooltipPadding( int tooltipPadding ) {
    checkWidget();
    this.tooltipPadding = tooltipPadding;
    if( tooltipPadding != 0 ) {
      remoteObject.set( "tooltipPadding", tooltipPadding );
    }
  }

  public int getTooltipPadding() {
    return tooltipPadding;
  }

  public boolean isDisplayGridLines() {
    return displayGridLines;
  }

  /**
   * Optional. Grid lines are displayed if this attribute is true. Default is false.
   * 
   * @param displayGridLines
   */
  public void setDisplayGridLines( boolean displayGridLines ) {
    checkWidget();
    this.displayGridLines = displayGridLines;
    if( displayGridLines ) {
      remoteObject.set( "displayGridLines", displayGridLines );
    }
  }
  
  public float getThresholdValue() {
    return thresholdValue;
  }

  /** If the percentage value is below the threshold value the threshold value
   * is the max value of the (percentage) y-axis. Otherwise the max percentage 
   * value is used as max value of this y-axis. 
   * @param thresholdValue as float (e.g. 0.01f is 1%, 1.00f is 100%)
   */
  public void setThresholdValue( float thresholdValue ) {
    checkWidget();
    this.thresholdValue = thresholdValue;
    if( thresholdValue != 0f) {
      remoteObject.set( "thresholdValue", thresholdValue );
    }
  }

  public String getNumeratorName() {
    return numeratorName;
  }

  /**
   * Sets the numerator's name that is used in the chart.
   * 
   * @param numeratorName
   */
  public void setNumeratorName( String numeratorName ) {
    this.numeratorName = numeratorName;
  }

  public String getDenominatorName() {
    return denominatorName;
  }

  /**
   * Sets the denominator's name that is used in the chart.
   * 
   * @param denominatorName
   */
  public void setDenominatorName( String denominatorName ) {
    this.denominatorName = denominatorName;
  }
  
  /**
   * Sets the numerator's and the denominator's name that is used in the chart. These names must be
   * declared before setting the numerator's and the denominator's values.
   * 
   * @param numeratorName
   * @param denominatorName
   */
  public void setNumeratorAndDenominatorNames( String numeratorName, String denominatorName ) {
    this.numeratorName = numeratorName;
    this.denominatorName = denominatorName;
  }

  /**
   * Adds a bar to the chart. A bar has one unique name, and values for numerator and denominator.
   * numeratorName and denominatorName must be declared before the first call of this method. <br>
   * displayNewValues() must be called after all values are added.
   * 
   * @param name describes the unique name of the bar (e.g. "Yes votes")
   * @param numerator is this bar's numerator value
   * @param denominator is this bar's denominator value
   */
  public void addValue( String name, int numerator, int denominator ) {
    if( getNumeratorName() == null | getDenominatorName() == null ) {
      throw new NullPointerException( "numeratorName and denominatorName must not be null when calling VerticalBarChart.addValue" );
    } else {
      if( values == null ) {
        values = new JsonArray();
      }
      JsonObject jsonObject = new JsonObject();
      jsonObject.add( "name", name );
      jsonObject.add( numeratorName, numerator );
      jsonObject.add( denominatorName, denominator );
      values.add( jsonObject );
    }
  }

  /**
   * Displays the added values in the chart. Should be called after the last call of the method
   * addValue.
   */
  public void displayNewValues() {
    checkWidget();
    remoteObject.set( "values", values );
  }

  @Override
  public void copyValuesOfAnotherInstance( ResponsiveChart responsiveChart ) {
    DualScaleChart otherInstance = ( DualScaleChart )responsiveChart;
    this.setValues( otherInstance.getValues() );
    this.setColorTotal( otherInstance.getColorTotal() );
    this.setColorPercentage( otherInstance.getColorPercentage() );
    this.setDescriptionTotal( otherInstance.getDescriptionTotal() );
    this.setDescriptionPercentage( otherInstance.getDescriptionPercentage() );
    this.setFontAttribute( otherInstance.getFontAttribute() );
    this.setYAxisLabelWidth( otherInstance.getYAxisLabelWidth() );
    this.setPaddingRight( otherInstance.getPaddingRight() );
    this.setPercentageDigitsAfterDecimalPoint( otherInstance.getPercentageDigitsAfterDecimalPoint() );
    this.setTooltipBoxHeight( otherInstance.getTooltipBoxHeight() );
    this.setTooltipBoxWidth( otherInstance.getTooltipBoxWidth() );
    this.setTooltipPadding( otherInstance.getTooltipPadding() );
    this.setDisplayGridLines( otherInstance.isDisplayGridLines() );
    this.setThresholdValue( otherInstance.getThresholdValue() );
  }

  @Override
  public ResponsiveChart getNewInstance() {
    DualScaleChart newInstance = new DualScaleChart( ( ResponsiveChartComposite )this
      .getParent(), this.getStyle() );
    newInstance.copyValuesOfAnotherInstance( this );
    return newInstance;
  }
}
