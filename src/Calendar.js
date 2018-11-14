/* global window */
/* eslint no-restricted-globals: ["off"] */

import React from 'react';
import $ from 'jquery';
import { Calendar } from 'fullcalendar';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import 'moment/locale/ko';
import moment from "moment";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/fullcalendar/dist/fullcalendar.min.css';


class FullCalendar extends React.Component {
		constructor(props) {
			super(props);
    	this.state = {
				viewDatePicker: moment(),
				submit: false,
				modal: false,
				events: [
					{
						id: 1,
						title: '테헤란로',
						start: "2018-11-14T10:00",
						end: "2018-11-14T14:00"
					},
					{
						id: 2,
						title: '강남구',
						start: "2018-11-07T15:00",
						end: "2018-11-07T20:00"
					},
				],
				nowEvent: {
					id: '',
					title: '',
					start: '',
					startTime: '',
					endTime: '',
					date: '',
					end: ''
				},
			};
			this.toggle = this.toggle.bind(this);
			this.removeEvent = this.removeEvent.bind(this);
			this.addEvent = this.addEvent.bind(this);
			this.inputHandler = this.inputHandler.bind(this);
			this.dateHandler = this.dateHandler.bind(this);
		}
		
		submit() {
			this.setState({
				submit: !this.state.submit
			})
		}

		toggle() {
			this.setState({
				modal: !this.state.modal
			});
			this.submit();
		}

		inputHandler(e) {
			const id = this.state.events.map(event => event.id);
			const maxId = this.state.events.length === 0 ? 1 : Math.max(...id) + 1;

			if (e.target.id === 'inputName') { 
				const inputName = e.target.value;
				this.setState({
					nowEvent: {
						id: maxId,
						date: this.state.nowEvent.date,
						title: inputName,
						start: this.state.nowEvent.start,
						end: this.state.nowEvent.end
					}
				})
			} else if (e.target.id === 'startTime') { 
				const startTime = e.target.value
				this.setState({
					nowEvent: {
						id: this.state.nowEvent.id,
						date: this.state.nowEvent.date,
						title: this.state.nowEvent.title,
						start: this.state.nowEvent.date + 'T' + startTime,
						end: this.state.nowEvent.end
					}
				})
			} else if (e.target.id === 'endTime') { 
				const endTime = e.target.value
				this.setState({
					nowEvent: {
						id: this.state.nowEvent.id,
						title: this.state.nowEvent.title,
						date: this.state.nowEvent.date,
						start: this.state.nowEvent.start,
						end: this.state.nowEvent.date + 'T' + endTime
					}
				})
			} else {
				this.setState({
					nowEvent: {
						title: '',
						date: '',
						start: '',
						end: '',
						startTime: '',
						endTime: ''
					}
				})
			}
		}

		dateHandler(date) {
			this.setState({
					nowEvent: {
						id: this.state.nowEvent.id,
						title: this.state.nowEvent.title,
						start: date.format('YYYY-MM-DDT'+this.state.nowEvent.startTime),
						date: date.format('YYYY-MM-DD'),
						startTime: this.state.nowEvent.startTime,
						endTime: this.state.nowEvent.endTime,
						end: date.format('YYYY-MM-DDT'+this.state.nowEvent.endTime)
					},
					viewDatePicker: date
			})
			this.submit();
		}
		
		movedEvent(event) {
			this.setState({
				events: this.state.events.concat(
					{
						id: event.id,
						title : event.title,
						start : event.start.format(),
						end : event.end.format()
					}
				)
			})
			this.submit();
			console.log(this.state.events);
		}
		
		addEvent() {
			const id = this.state.events.map(event => event.id);
			const checkId = this.state.events.map(event => event.id).indexOf(this.state.nowEvent.id);
			const maxId = this.state.events.length === 0 ? 1 : checkId === -1 ? Math.max(...id) + 1 : this.state.nowEvent.id;
			
			if(checkId !== -1) {
				const newEvent = this.state.events.filter((event) => { return event.id !== this.state.nowEvent.id; });
				console.log(newEvent);
				this.calendarView.removeEventSources(event);
				this.setState({ 
					events: newEvent.concat(
						{
							id: this.state.nowEvent.id,
							title: this.state.nowEvent.title,
							start: this.state.nowEvent.start,
							end: this.state.nowEvent.end
						}
					),
					nowEvent: {
						id: '',
						title: '',
						start: '',
						date: '',
						end: ''
					}
				});
				this.calendarView.addEventSource(this.state.events);
			} else {
				this.setState({ 
					events: this.state.events.concat(
						{
							id: maxId,
							title: this.state.nowEvent.title,
							start: this.state.nowEvent.start,
							end: this.state.nowEvent.end
						}
					),
					nowEvent: {
						id: '',
						title: '',
						start: '',
						date: '',
						end: ''
					}
				})
			}
				this.submit();
				this.toggle();
		}

		removeEvent() {
			const newEvent = this.state.events.filter((event) => {
					return event.id !== this.state.nowEvent.id;
				});
			const remove = confirm('일정을 삭제하시겠습니까?');
			if(remove) {
				this.calendarView.removeEventSources(event);
				this.setState({ 
					events: newEvent,
					nowEvent: {
						id: '',
						title: '',
						start: '',
						date: '',
						end: ''
					}
				});
				this.calendarView.addEventSource(newEvent);
				this.submit();
				this.toggle();
			} else {
				return;
			}
		}

		nowEvent(event) {
			this.setState({
				nowEvent: {
					id: event.id,
					title: event.title,
					start: event.start.format(),
					date: event.start.format('YYYY-MM-DD'),
					startTime: event.start.format('HH:mm'),
					endTime: event.end.format('HH:mm'),
					end: event.end.format()
				}
			})
		}

		checkId(event) {
			this.setState({
				events : this.state.events.filter((_event) => {
					return event.id !== _event.id;
				})
			});
		}
		
    render() {
			if(this.calendarView) {
				this.calendarView.render();
			}
        return ( 
					<div>
							<div id="calendar" /><br/>
							<p> copyright 2018 purpleworks </p>
							<div id="modalView">
        			<Modal isOpen={this.state.modal} toggle={this.toggle}>
								<ModalHeader> 
									<label htmlFor="inputDate" className="col-form-label">날짜</label><br/>
									<DatePicker placeholderText={this.state.nowEvent.date} selected={this.state.startDate} onChange={this.dateHandler} dateFormat="LL"/><br/>
									<label htmlFor="inputName" className="col-form-label">오피스명</label>
            			<input type="text" className="form-control" id="inputName" onChange={this.inputHandler} defaultValue={this.state.nowEvent.title} />
								</ModalHeader>
          		  <ModalBody>
									<p className="font-weight-bold">상담시간</p>
									<label htmlFor="startTime" className="col-form-label">시작시간</label><br/>
            			<input type="text" className="form-control" id="startTime" onChange={this.inputHandler} placeholder="ex)13:00" defaultValue={this.state.nowEvent.startTime} />
									<label htmlFor="endTime" className="col-form-label">종료시간</label>
            			<input type="text" className="form-control" id="endTime" onChange={this.inputHandler} placeholder="ex)16:00" defaultValue={this.state.nowEvent.endTime}/>
          			</ModalBody>
          			<ModalFooter>
            			<Button color="secondary" onClick={this.toggle}>취소</Button>
            			<Button color="danger" onClick={this.removeEvent}>삭제</Button>
            			<Button color="primary" onClick={this.addEvent}>저장</Button>
          			</ModalFooter>
        			</Modal>
							</div>
					</div>
        );
		}

    componentDidMount() { 
			const calendar = $('#calendar');
			
			this.calendarView = new Calendar(calendar, {
				schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
				themeSystem: 'bootstrap4',
				locale: 'ko',
				defaultView: 'month',
				nowIndicator: true,
				displayEventTime: true,
				editable: true,
				eventLimit: true,
				eventColor: '#007BFF',
				eventTextColor: '#FFF',
				selectable: true,
				showNonCurrentDates: true,
				navLinks: true,
				timeFormat: 'HH:mm',
				events: this.state.events,	
				eventOverlap: false,
				buttonText: {
					today:    '오늘',
					month:    '월간',
					week:     '주간',
					day:      '일간',
					listYear: '상담목록',
					prev: '이전',
					next: '다음',
					prevYear: '작년',
					nextYear: '내년'
				},
				customButtons: {
					addEventButton: {
						text: '상담 추가',
						click: function() {
							console.log('click button');
						}
					}
				},
				header: {
					left: 'prev,today,next prevYear,nextYear',
					center: 'title',
					right: 'month,agendaWeek listYear',
				},
				views: {
					month: {
						titleFormat: 'YYYY년 MM월'
					},
					
					week: {
						titleFormat: 'YYYY년 MM월 DD'	
					},
					
					day: {
						titleFormat: 'YYYY년 MM월 DD일'
					}
					
				},
				eventClick: (event) => {
					this.nowEvent(event);
					this.toggle();
				},

				eventDrop: (event, delta, revertFunc) => {
					if (confirm('일정을 변경 하시겠습니까?')) {
						this.checkId(event);
						this.movedEvent(event);
						} else {
							revertFunc();
						}
						this.submit();
				},

				eventResize: (event, delta, revertFunc) => {
					if(confirm('시간을 변경 하시겠습니까?')) {
						this.checkId(event);
						this.setState({
							events: this.state.events.concat(
								{
									id: event.id,
									title : event.title,
									start : event.start.format(),
									end : event.end.format()
								}
							)
						})
						this.nowEvent(event);
					} else {
						revertFunc();
					}
					this.submit();
				},

				dayClick: (date) => {
					this.setState({
						nowEvent: {
							id: '',
							title: '',
							start: '',
							date: date.format(),
							end: ''
						}
					})
					this.submit();
					this.toggle();
				}
			});
			this.calendarView.render();
		}

		shouldComponentUpdate(nextProps, nextState) {
			let result = false;
			if (this.state.submit !== nextState.submit) {
				this.calendarView.removeEventSources(event);
				this.calendarView.addEventSource(nextState.events);
				result = true;
			}
			return result;
		}
	}
	
	export default FullCalendar