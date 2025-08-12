let html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style type="text/css">
        a[x-apple-data-detectors] {
            color: inherit !important;
        }
    </style>
    <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" /> 
  <style type="text/css">
    body {
      font-family: "HelveticaNeue", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif
    }
    .track-no {
      text-decoration: unset;
    }
    .track-no:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  </style>
</head>

<body style="margin: 0; padding: 0">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">

                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="">
                    <tr>
                        <td align="center"style="padding:10px 15px 20px 15px;">
                           <table style="width: 100%;">
                               <tr>
                                   <td style="font-size: 64px; color: rgb(35, 35, 35); font-weight: bold;width:50%;line-height: 24px; "><img _ngcontent-svl-c111="" class="logo ng-star-inserted" src="{{logo}}" alt="LOGO" style="width: 50%;"></td>
                                   <td style="width:50%; border-radius: 6px;border: 1px solid rgb(151, 151, 151); font-size: 14px; line-height: 26px; border:1px solid #dee2e6; padding: 15px;">
                                        <span style="color: rgb(139, 14, 4); font-size: 14px;">Order#: </span>{{order_id}}<br>
                                        <span style="color: rgb(139, 14, 4); font-size: 14px;">Status: </span>{{status}}<br>
                                        <span style="color: rgb(139, 14, 4); font-size: 14px;">Fullfilled By: </span>{{fulfilled_by}}
                                    </td>
                               </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0px 15px 15px;font-size: 14px;color: rgb(35, 35, 35); line-height: 14px;">
                            {{emailBody.row_1}}
                        </td>
                    </tr>
                    {{#if emailBody.row_2}}
                    <tr>
                        <td style="padding: 5px 15px 20px 15px;font-size: 14px;color: rgb(35, 35, 35); line-height: 14px;">
                        {{emailBody.row_2}}
                        </td>
                    </tr>
                    {{/if}}
                     <tr>
                        <td style="padding: 0 15px;width: 137px;height: 16px;color: rgb(35, 35, 35);font-size: 16px;font-weight: bold;line-height: 16px;">
                            Order Information
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 15px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 6px;padding: 20px;border: 1px solid #c4c4c4;">
                               <tr>
                                   <td style="width: 50%; vertical-align: top;">
                                      <table border="0" cellpadding="0" cellspacing="10" width="100%">
                                      {{#if product_detail}}
                                      {{#each product_detail}}`;
html += `<tr>
                                            <td>
                                              <img width="80px" height="88px" src="{{product_img}}" >
                                            </td>
                                            <td style="ont-size: 14px;color: rgb(35, 35, 35);"> 
                                            <span style="font-size: 14px;color: rgb(35, 35, 35);font-weight: 600">{{name}}</span><br/>
                                              <span style="font-size: 12px;color: rgb(35, 35, 35);">{{size}}</span><br/>
                                              <span style="font-size: 12px;color: rgb(35, 35, 35);font-weight: 600">{{price}}</span><br/><br/>
                                              <span style="font-size: 14px;color: rgb(84, 84, 84);">Qty: {{qty}} &nbsp; &nbsp; &nbsp;</span> 
					                                    <span style="font-size: 12px;color: rgb(35, 35, 35); font-weight: 600">{{product_total}}</span>
					                                  </td>
                                            </tr>`;
html += `{{/each}}{{/if}}</table> 
                                   </td>
                                   <td style="flex: 0 0 auto;width: 41.6666666667%;vertical-align: top;">
                                       <table border="0" cellpadding="0" cellspacing="10" width="100%" >
                                            <tr>
                                                <td style="font-size: 14px;padding-bottom: 15px;">
                                                   <span style="font-size: 14px;color: rgb(139, 14, 4); display: inline-block; padding-bottom: 10px;">Delivery Address</span><br>
                                                   <span style="font-size: 14px;color: rgb(35, 35, 35); line-height: 14px;">{{#if delivery_address.address_line_1}}{{delivery_address.address_line_1}}<br>{{/if}}
                                                   {{delivery_address.city}}, {{delivery_address.state}} {{#if delivery_address.zip_code}}{{delivery_address.zip_code}}{{/if}}</span>
                                                </td>
                                            </tr>
                                            {{#if trackingDetail}}
                                            <tr>
                                                <td style="font-size: 14px;padding-bottom: 15px;">
                                                   <span style="font-size: 14px;color: rgb(139, 14, 4); display: inline-block; padding-bottom: 10px;">Tracking Number</span><br>
                                                   <span style="font-size: 14px;color: rgb(39, 39, 39); line-height: 16px;text-decoration: unset;"><a style="font-size: 14px;color: rgb(39, 39, 39); line-height: 16px;" class="track-no" href="#">{{trackingDetail.trackingNo}}</a></span><br>
                                                   <span style="font-size: 14px;color: rgb(39, 39, 39); line-height: 16px;">{{trackingDetail.line_1}}</span>
                                                </td>
                                            </tr>
                                            {{/if}}
                                       </table>
                                   </td>
                               </tr> 
                            </table>
                        </td>
                    </tr>`;
html += `<tr>
                        <td align="center"style="padding:10px 15px 20px 15px;">
                           <table style="width: 100%;">
                               <tr>
                                   <td style="width: 42%">
                                       <table style="width: 92%">
                                            <tbody>
                                                <tr>
                                                  <td style="font-size: 16px;color: rgb(35, 35, 35);font-weight: bold;">Total</td>                  
                                                </tr>
                                                <tr>
                                                <td style="border-radius: 6px;border: 1px solid rgb(151, 151, 151); font-size: 14px; border:1px solid #dee2e6; padding: 11px;">
                                                      <table style="width: 100%">
                                                        <tr style="font-size: 14px;color: rgb(35, 35, 35);line-height: 20px;">
                                                          <td>Subtotal</td>
                                                          <td style="text-align: right"><span>{{payment_detail.sub_total}}</span></td>
                                                        </tr>
                                                        {{#if payment_detail.promo_code}}
                                                        <tr style="font-size: 14px;color: rgb(35, 35, 35);line-height: 20px;">
                                                          <td><i>{{payment_detail.promo_code}}</i></td>
                                                          <td style="text-align: right">-<i>{{payment_detail.discount}}</i></td>
                                                        </tr>
                                                        {{/if}}
                                                        {{#if payment_detail.shipping_charge}}
                                                          <tr style="font-size: 14px;color: rgb(35, 35, 35);line-height: 20px;">
                                                            <td>Shipping</td>
                                                            <td style="text-align: right"><span>{{payment_detail.shipping_charge}}</span></td>
                                                          </tr>
                                                        {{/if}}
                                                        {{#if payment_detail.tax}}
                                                          <tr style="font-size: 14px;color: rgb(35, 35, 35); line-height: 20px;">
                                                            <td>Tax</td>
                                                            <td style="text-align: right"><span>{{payment_detail.tax}}</span></td>
                                                          </tr>
                                                        {{/if}}
                                                        <tr style="font-size: 16px;color: rgb(139, 14, 4);font-weight: bold;line-height: 20px;">
                                                          <td>Total</td>
                                                          <td style="text-align: right"><span>{{payment_detail.total}}<span></td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                            </tbody>
                                          </table>
                                    </td>
                                    <td style="width: 58%;">
                                      <table style="width: 100%;">
                                          <tr style="font-size: 16px; color: rgb(35, 35, 35); font-weight: bold;">
                                            <td>Questions about your order?</td>
                                          </tr>
                                          <tr>
                                             <td style="border-radius: 6px;border: 1px solid rgb(151, 151, 151); font-size: 14px;  border:1px solid #dee2e6; padding: 15px;">
                                              <table>
                                                <tr>
                                                  <td><span style="font-size: 12px;color: rgb(139, 14, 4);">Please contact:</span>
                                                  <span style="font-size: 14px;color: rgb(74, 74, 74);"><a href="mailto:orders@brandname.parkstreet.com">orders@brandname.parkstreet.com</a></span>
                                                    <ul style="padding-left: 16px;font-size: 12px;color: rgb(74, 74, 74);">
                                                      <li style="list-style: disc;">Someone over the age of 21 must be present to sign for the delivery of alcohol products.</li>
                                                      <li style="list-style: disc;">Items my be shipped and arrive seperately.</li>
                                                    </ul>
                                                  </td>
                                                </tr>                                               
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    {{#if footerData.row_1}}
                      <tr>
                        <td style="padding-top: 15px; color: rgb(139, 14, 4);font-size: 14px;font-weight: bold;height: 14px;line-height: 22px;text-align: center;">
                          <span>{{footerData.row_1}}</span>
                        </td>
                      </tr>
                    {{/if}}
                    <tr>
                      <td align="center" valign="middle" style="color: rgb(35, 35, 35);font-size: 7px;
                      font-weight: bold;background-color: rgba(0, 0, 0, 0.05);height: 46px;">
                        Copyright © 2007-2021 Brand Name, LLC. All Rights Reserved.
                      </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
module.exports = html;
