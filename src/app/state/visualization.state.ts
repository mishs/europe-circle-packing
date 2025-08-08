import { createAction, createReducer, on, props, createSelector } from '@ngrx/store';
import { Country } from '../models/country.model';

export type ValueProperty = 'population' | 'land_area_km2';

export interface VisualizationState {
  valueProperty: ValueProperty;
  selectedCountry: Country | null;
}

const initialState: VisualizationState = {
  valueProperty: 'population',
  selectedCountry: null,
};

export const setValueProperty = createAction(
  '[Viz] Set Value Property', props<{ valueProperty: ValueProperty }>()
);
export const selectCountry = createAction(
  '[Viz] Select Country', props<{ country: Country | null }>()
);

export const visualizationReducer = createReducer(
  initialState,
  on(setValueProperty, (state, { valueProperty }) => ({ ...state, valueProperty })),
  on(selectCountry, (state, { country }) => ({ ...state, selectedCountry: country })),
);

// selectors
export const selectValueProperty = (state: { visualization: VisualizationState }) => state.visualization.valueProperty;
export const selectSelectedCountry = (state: { visualization: VisualizationState }) => state.visualization.selectedCountry;
