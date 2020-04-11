const minibarHTMLText = `
<div class="minibar-container noselect overlay">
<div class="section-title-container">
  <p>location</p>
  <!--<button title="Apply Coordinate" id="updateLocation">&#x21bb;</button>-->
  <!-- <button title="More Settings" id="expandBtn" class="settingsbtn">
    &DownArrowBar;
  </button> -->
</div>
<div class="textinput-container">
  <label title="x location" for="xInput">x:</label>
  <input id="locXInput" type="text" />
</div>
<div class="textinput-container">
  <label title="y location" for="yInput">y:</label>
  <input id="locYInput" type="text" />
</div>
<div class="textinput-container aligned-container">
  <label title="Maximum iteration" for="maxiter">iteration:</label>
  <input id="maxiter" type="text" value="256" />
  <label title="Maximum escape radius" for="maxrad">radius:</label>
  <input id="maxrad" type="text" value="10" />
</div>
<div class="rangeinput-container">
  <p>symmetry:</p>
  <input
    type="range"
    min="0"
    max="100"
    value="0"
    class="slider"
    id="syminput"
  />
</div>
<div class="rangeinput-container">
  <p>color gradient</p>
  <input
    type="range"
    min="0"
    max="100"
    value="0"
    class="slider redslider"
    id="redinput"
  />
  <input
    type="range"
    min="0"
    max="100"
    value="0"
    class="slider greenslider"
    id="greeninput"
  />
  <input
    type="range"
    min="0"
    max="100"
    value="0"
    class="slider blueslider"
    id="blueinput"
  />
</div>
</div>
`

export { minibarHTMLText }
