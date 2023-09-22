import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterState } from './router-serializer';
import { RouterReducerState } from '@ngrx/router-store';

export const selectRouterState = createFeatureSelector<RouterReducerState<RouterState>>('router');

export const selectParams = createSelector(
selectRouterState,
router => router?.state?.params
);

export const selectQueryParams = createSelector(
selectRouterState,
router => router?.state?.queryParams
);

export const selectUrl = createSelector(
selectRouterState,
router => router?.state?.url
);
