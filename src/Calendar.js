/* global window */
/* eslint no-restricted-globals: ["off"] */

import React from 'react';
import $ from 'jquery';
import { Calendar } from 'fullcalendar';
import 'moment/locale/ko';
// import moment from 'moment';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/fullcalendar/dist/fullcalendar.min.css';

class FullCalendar extends React.Component {
		constructor(props) {
			super(props);
    	this.state = {
				submit: false,
				modal: false,
				events: [
					{
						id: 1,
						title: '테헤란로',
						start: "2018-11-01T10:00",
						end: "2018-11-01T14:00"
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
					date: '',
					end: ''
				},
			};
			this.toggle = this.toggle.bind(this);
			this.removeEvent = this.removeEvent.bind(this);
			this.addEvent = this.addEvent.bind(this);
			this.inputHandler = this.inputHandler.bind(this);
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
			if (e.target.id === 'inputName') { 
				const inputName = e.target.value;
				this.setState({
					nowEvent: {
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
		
		movedEvent(inputTitle, startTime, endTime, id) {
			this.setState({
				events: this.state.events.concat(
					{
						id: id,
						title : inputTitle,
						start : startTime,
						end : endTime
					}
				)
			})
			this.submit();
			console.log(this.state.events);
		}
		
		addEvent() {
			let id = this.state.events.map(event => event.id);
			let maxId = this.state.events.length === 0 ? 1 : Math.max(...id) + 1;
			
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
				this.submit();
				this.toggle();
		}

		removeEvent() {
			const newEvent = this.state.events.filter((event) => {
					return event.id !== this.state.nowEvent.id;
				});
			const remove = confirm('일정을 삭제하시겠습니까?');
			if(remove) {
				this.calendarView.removeEvents(event);
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

		nowEvent(event, date, startTime, endTime) {
			this.setState({
				nowEvent: {
					id: event.id,
					title: event.title,
					start: date + 'T' + startTime,
					date: date,
					startTime: startTime,
					endTime: endTime,
					end: date + 'T' + endTime
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
									{this.state.nowEvent.date} <br/><br/> 
									<label htmlFor="inputName" className="col-form-label">오피스명</label>
            			<input type="text" className="form-control" id="inputName" onChange={this.inputHandler} defaultValue={this.state.nowEvent.title} />
								</ModalHeader>
          		  <ModalBody>
									<p className="font-weight-bold">상담시간</p>
									<label htmlFor="startTime" className="col-form-label">시작시간</label>
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
				nowIndicator: true,
				displayEventTime: true,
				editable: true,
				eventLimit: true,
				eventColor: '#007BFF',
				eventTextColor: '#FFF',
				selectable: true,
				showNonCurrentDates: false,
				navLinks: true,
				timeFormat: 'HH:mm',
				events: (start,end, timezone, callback) => {
					callback(this.state.events);
				},	
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
					right: 'month,agendaWeek,agendaDay listYear',
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
					console.log(event.id);
					const startTime = event.start.format('HH:mm');
					const endTime = event.end.format('HH:mm');
					const date = event.start.format('YYYY-MM-DD');
					this.nowEvent(event, date, startTime, endTime);
					this.toggle();
				},

				eventDrop: (event, delta, revertFunc) => {
					const startTime = event.start.format();
					const endTime = event.end.format();
					const id = event.id
					if (confirm('일정을 변경 하시겠습니까?')) {
						this.checkId(event);
						this.movedEvent(event.title, startTime, endTime, id);
						} else {
							revertFunc();
						}
						this.submit();
				},

				eventResize: (event, delta, revertFunc) => {
					const startTime = event.start.format('HH:mm');
					const date = event.start.format('YYYY-MM-DD');
					const endTime = event.start.format('YYYY-MM-DD') + 'T' + event.end._i[3]+ ':' +event.end._i[4];
					if(confirm('시간을 변경 하시겠습니까?')) {
						this.checkId(event);
						this.setState({
							events: this.state.events.concat(
								{
									id: event.id,
									title : event.title,
									start : event.start.format('YYYY-MM-DD HH:mm'),
									end : endTime
								}
							)
						})
						this.nowEvent(event, date, startTime, endTime);
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
				this.calendarView.removeEvents(event);
				this.calendarView.addEventSource(nextState.events);
				result = true;
			}
			return result;
		}
	}
	
	export default FullCalendar