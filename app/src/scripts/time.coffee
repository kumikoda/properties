class Timepicker extends Backbone.View

  events : 
    'click .hour' : 'setHour'
    'click .minute' : 'setMinute'
    'click .apm' : 'setApm'

  initialize : ->
    el = @options.el
    
    # initialeze time to now
    @setCurrentTime()

    # cache jquery selectors
    @$hour = @$el.find '.selected-hour'
    @$minute = @$el.find '.selected-minute'
    @$apm = @$el.find '.selected-apm'

    @render() 

  setCurrentTime : ->
    now = new Date()
    @hour = now.getHours()
    if @hour > 12
      @hour = @hour - 12
      @apm = 'PM'
    else 
      @apm = 'AM'

    minute = now.getMinutes()
    r = minute%5
    if r > 2
      @minute = minute - r + 5 
    else
      @minute = minute - r

    if @minute < 10
      @minute = '0' + @minute

  setHour : (e) =>
    @hour = $(e.currentTarget).data 'value'
    @render()

  setMinute : (e) =>
    @minute = $(e.currentTarget).data 'value'
    if @minute is 0
      @minute = '00'
    if @minute is 5
      @minute = '05'
    @render()

  setApm : (e) =>
    @apm = $(e.currentTarget).data 'value'
    @render()

  getTime : ->
    if @apm is 'PM'
      @hour + 12
    else
      @hour

  render : ->
    @$hour.text @hour
    @$minute.text @minute
    @$apm.text @apm

    @trigger 'time', @getTime()

