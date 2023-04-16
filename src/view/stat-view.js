// import { Chart } from "chart.js";
import AbstractView from "../framework/abstract-view.js";

const statTemplate = () => {
	// visually-hidden trip-events--hidden
	return `<section class="trip-events  ">
          <h2 class="">Trip events</h2>
        </section>

        <section class="statistics">
          <h2 class="">Trip statistics</h2>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="money" width="900"></canvas>
          </div>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="type" width="900"></canvas>
          </div>

          <div class="statistics__item">
            <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
          </div>
        </section>`;
}

export default class StatView extends AbstractView {
	getTemplate() {
		console.log(statTemplate());
		return statTemplate();
	}
}