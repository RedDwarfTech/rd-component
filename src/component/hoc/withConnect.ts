import { AppState } from '@/models/types/AppState';
import { connect } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  robot: state.robot,
});

const mapDispatchToProps = (dispatch: any) => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect; 